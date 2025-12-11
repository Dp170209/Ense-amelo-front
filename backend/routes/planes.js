const express = require('express');
const Plan = require('../models/Plan');
const Suscripcion = require('../models/Suscripcion');
const Pago = require('../models/Pago');
const Usuario = require('../models/Usuario');
const { authenticateToken } = require('./auth');
const config = require('../config');

// IMPORTANTE: la clave real de Stripe debe ir en variables de entorno, no en el repositorio.
// Usa process.env.STRIPE_SECRET_KEY y configuéralo en tu entorno.
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || config.STRIPE_SECRET_KEY;
let stripe = null;
if (stripeSecretKey) {
  // require aquí para no romper si falta la dependencia en algún entorno
  // eslint-disable-next-line global-require
  stripe = require('stripe')(stripeSecretKey);
}

const router = express.Router();

// Middleware para comprobar rol a partir del userId del token
const requireRole = (rolesPermitidos) => async (req, res, next) => {
  try {
    const usuario = await Usuario.findById(req.user.userId);
    if (!usuario) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }

    if (!rolesPermitidos.includes(usuario.rol)) {
      return res.status(403).json({ success: false, message: 'No tienes permisos para esta acción' });
    }

    next();
  } catch (error) {
    console.error('Error verificando rol de usuario:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

// Listar planes activos (público: estudiantes, tutores y admin pueden ver precios)
router.get('/', async (req, res) => {
  try {
    const planes = await Plan.find({ estado: 'activo' }).sort({ precio: 1 });
    res.json({ success: true, planes });
  } catch (error) {
    console.error('Error obteniendo planes:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
});

// Crear nuevo plan (solo admin)
router.post('/', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const { nombre, descripcion, precio, duracionDias, cantidadCursos } = req.body;

    if (!nombre || !descripcion || typeof precio !== 'number' || !duracionDias || !cantidadCursos) {
      return res.status(400).json({
        success: false,
        message: 'nombre, descripcion, precio (number), duracionDias y cantidadCursos son requeridos',
      });
    }

    // Crear producto en Stripe
    let stripeProductId = null;
    if (stripe) {
      try {
        const product = await stripe.products.create({
          name: nombre,
          description: descripcion,
          metadata: {
            duracionDias: duracionDias.toString(),
            cantidadCursos: cantidadCursos.toString(),
          },
        });

        // Crear precio en Stripe
        const price = await stripe.prices.create({
          product: product.id,
          unit_amount: Math.round(precio * 100), // Convertir a centavos
          currency: 'usd',
          metadata: {
            planId: 'will_be_updated_later',
          },
        });

        stripeProductId = product.id;
      } catch (stripeError) {
        console.error('Error creando producto en Stripe:', stripeError);
        // Continuamos aunque falle Stripe, pero lo registramos
      }
    }

    const nuevoPlan = await Plan.create({
      nombre,
      descripcion,
      precio,
      duracionDias,
      cantidadCursos,
      stripeProductId,
      estado: 'activo',
    });

    res.status(201).json({ success: true, plan: nuevoPlan });
  } catch (error) {
    console.error('Error creando plan:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
});

// Obtener suscripción activa del usuario autenticado (solo tutor/docente)
router.get('/mi-suscripcion', authenticateToken, requireRole(['docente']), async (req, res) => {
  try {
    const ahora = new Date();
    const suscripcion = await Suscripcion.findOne({
      id_usuario: req.user.userId,
      fin: { $gte: ahora },
      estado: 'activa',
    })
      .populate('id_plan');

    res.json({ success: true, suscripcion: suscripcion || null });
  } catch (error) {
    console.error('Error obteniendo suscripción:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
});

// Crear sesión de pago Stripe para un plan (solo tutor/docente)
router.post('/crear-sesion', authenticateToken, requireRole(['docente']), async (req, res) => {
  try {
    if (!stripe) {
      return res.status(500).json({
        success: false,
        message: 'Stripe no está configurado en el servidor',
      });
    }

    const { id_plan } = req.body;
    if (!id_plan) {
      return res.status(400).json({ success: false, message: 'id_plan es requerido' });
    }

    const plan = await Plan.findById(id_plan);
    if (!plan || plan.estado !== 'activo') {
      return res.status(404).json({ success: false, message: 'Plan no encontrado o inactivo' });
    }

    // Crear primero una suscripción en estado pendiente para este usuario y plan
    const inicio = new Date();
    const fin = new Date(inicio.getTime() + plan.duracionDias * 24 * 60 * 60 * 1000);

    const suscripcion = await Suscripcion.create({
      id_usuario: req.user.userId,
      id_plan: plan._id,
      inicio,
      fin,
      estado: 'activa',
    });

    // Crear registro de pago pendiente
    const pago = await Pago.create({
      id_suscripcion: suscripcion._id,
      monto: plan.precio,
      metodo: 'stripe',
      estado: 'pendiente',
    });

    // Asumimos que trabajas en USD o Bs; Stripe requiere el monto en centavos
    const amountInCents = Math.round(plan.precio * 100);

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription', // Cambiado a subscription para renovaciones automáticas
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Plan ${plan.nombre}`,
              description: plan.descripcion,
              metadata: {
                planId: plan._id.toString(),
                duracionDias: plan.duracionDias.toString(),
                cantidadCursos: plan.cantidadCursos.toString(),
              },
            },
            unit_amount: Math.round(plan.precio * 100),
            recurring: {
              interval: 'day',
              interval_count: plan.duracionDias, // Renovar cada N días
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        pagoId: pago._id.toString(),
        suscripcionId: suscripcion._id.toString(),
        planId: plan._id.toString(),
        userId: req.user.userId,
      },
      success_url: `${req.headers.origin || ''}/planes/success`,
      cancel_url: `${req.headers.origin || ''}/planes/cancel`,
    });

    pago.stripeSessionId = session.id;
    await pago.save();

    res.json({ success: true, url: session.url, sessionId: session.id });
  } catch (error) {
    console.error('Error creando sesión de pago:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
});

// Cancelar suscripción (solo tutor/docente)
router.post('/cancelar-suscripcion', authenticateToken, requireRole(['docente']), async (req, res) => {
  try {
    const ahora = new Date();
    
    // Buscar suscripción activa del usuario
    const suscripcion = await Suscripcion.findOne({
      id_usuario: req.user.userId,
      estado: 'activa',
      fin: { $gte: ahora }
    }).populate('id_plan');

    if (!suscripcion) {
      return res.status(404).json({ 
        success: false, 
        message: 'No tienes una suscripción activa para cancelar.' 
      });
    }

    // Cancelar en Stripe si hay suscripción recurrente
    if (stripe && suscripcion.stripeSubscriptionId) {
      try {
        await stripe.subscriptions.update(suscripcion.stripeSubscriptionId, {
          cancel_at_period_end: true, // Cancelar al final del período
        });
        
        console.log(`Suscripción Stripe ${suscripcion.stripeSubscriptionId} marcada para cancelar al final del período`);
      } catch (stripeError) {
        console.error('Error cancelando suscripción en Stripe:', stripeError);
        // Continuamos aunque falle Stripe
      }
    }

    // Marcar como cancelada localmente (pero sigue vigente hasta fin)
    suscripcion.estado = 'cancelada';
    suscripcion.fechaCancelacion = ahora;
    await suscripcion.save();

    // Si hay un pago pendiente, marcarlo como cancelado
    await Pago.updateOne(
      { id_suscripcion: suscripcion._id, estado: 'pendiente' },
      { estado: 'cancelado', fechaCancelacion: ahora }
    );

    res.json({ 
      success: true, 
      message: 'Suscripción cancelada. Continuarás teniendo acceso hasta el final del período actual.' 
    });
  } catch (error) {
    console.error('Error cancelando suscripción:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
});

// Webhook de Stripe para confirmar pagos
// IMPORTANTE: configura la ruta en el dashboard de Stripe y expón tu backend con un túnel si estás en local.
router.post('/webhook', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || config.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    if (!stripe || !endpointSecret) {
      return res.status(500).send('Stripe o webhook secret no configurados');
    }
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error(`⚠️  Webhook signature verification failed.`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const pagoId = session.metadata?.pagoId;
      const suscripcionId = session.metadata?.suscripcionId;
      
      if (pagoId) {
        const pago = await Pago.findById(pagoId).populate('id_suscripcion');
        if (pago) {
          pago.estado = 'exitoso';
          pago.stripePaymentIntentId = session.payment_intent;
          await pago.save();
        }
      }
      
      // Guardar IDs de Stripe para renovaciones y cancelaciones
      if (suscripcionId && session.subscription && session.customer) {
        const suscripcion = await Suscripcion.findById(suscripcionId);
        if (suscripcion) {
          suscripcion.stripeSubscriptionId = session.subscription;
          suscripcion.stripeCustomerId = session.customer;
          await suscripcion.save();
        }
      }
    } 
    // Manejar renovaciones automáticas
    else if (event.type === 'invoice.payment_succeeded') {
      const invoice = event.data.object;
      const subscriptionId = invoice.subscription;
      
      // Buscar suscripción por stripeSubscriptionId
      const suscripcion = await Suscripcion.findOne({ 
        stripeSubscriptionId: subscriptionId 
      }).populate('id_plan');
      
      if (suscripcion) {
        // Extender fecha de fin
        const plan = suscripcion.id_plan;
        const nuevoFin = new Date(suscripcion.fin.getTime() + plan.duracionDias * 24 * 60 * 60 * 1000);
        suscripcion.fin = nuevoFin;
        await suscripcion.save();
        
        // Crear nuevo registro de pago
        await Pago.create({
          id_suscripcion: suscripcion._id,
          monto: plan.precio,
          metodo: 'stripe',
          estado: 'exitoso',
          stripePaymentIntentId: invoice.payment_intent,
        });
        
        console.log(`Suscripción ${suscripcion._id} renovada hasta ${nuevoFin}`);
      }
    }
    // Manejar fallas en renovación
    else if (event.type === 'invoice.payment_failed') {
      const invoice = event.data.object;
      const subscriptionId = invoice.subscription;
      
      const suscripcion = await Suscripcion.findOne({ 
        stripeSubscriptionId: subscriptionId 
      });
      
      if (suscripcion) {
        // Crear registro de pago fallido
        await Pago.create({
          id_suscripcion: suscripcion._id,
          monto: suscripcion.id_plan.precio,
          metodo: 'stripe',
          estado: 'fallido',
          stripePaymentIntentId: invoice.payment_intent,
        });
        
        console.log(`Fallo en renovación de suscripción ${suscripcion._id}`);
      }
    }
    // Manejar cancelación desde Stripe
    else if (event.type === 'customer.subscription.deleted') {
      const subscription = event.data.object;
      const subscriptionId = subscription.id;
      
      const suscripcion = await Suscripcion.findOne({ 
        stripeSubscriptionId: subscriptionId 
      });
      
      if (suscripcion) {
        suscripcion.estado = 'cancelada';
        suscripcion.fechaCancelacion = new Date();
        await suscripcion.save();
        
        console.log(`Suscripción ${suscripcion._id} cancelada desde Stripe`);
      }
    }
    else if (event.type === 'checkout.session.expired' || event.type === 'checkout.session.async_payment_failed') {
      const session = event.data.object;
      const pagoId = session.metadata?.pagoId;
      if (pagoId) {
        const pago = await Pago.findById(pagoId).populate('id_suscripcion');
        if (pago) {
          pago.estado = 'fallido';
          await pago.save();
          if (pago.id_suscripcion) {
            pago.id_suscripcion.estado = 'cancelada';
            await pago.id_suscripcion.save();
          }
        }
      }
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Error procesando webhook de Stripe:', error);
    res.status(500).send('Webhook handler failed');
  }
});

module.exports = router;
