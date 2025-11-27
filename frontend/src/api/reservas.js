import api from "./config";

export const reservasAPI = {
  createReserva: ({ cursoId }) =>
    api.post("/reservas", { id_curso: cursoId }),

  aceptarReserva: ({ cursoId, estudianteId, inicio }) =>
    api.post("/reservas/aceptar", {
      id_curso: cursoId,
      id_estudiante: estudianteId,
      inicio,
    }),

  getReservasConfirmadasTutor: () =>
    api.get("/reservas/tutor/confirmadas"),
};
