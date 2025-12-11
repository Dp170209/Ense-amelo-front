module.exports = {
  MONGODB_URI:
    process.env.MONGODB_URI ||
    'mongodb+srv://jaredpitiu1709_db_user:dgWRtiOF9MGP9F8y@cluster0.6djiknt.mongodb.net/Enseniamelo-front',
  JWT_SECRET: process.env.JWT_SECRET || 'tu_jwt_secret_muy_seguro_aqui',
  PORT: process.env.PORT || 3000,
  // Claves de Stripe: configúralas en tu entorno (.env) y NO las subas al repositorio
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
}
