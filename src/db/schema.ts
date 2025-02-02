import { z } from "zod";

export const documentTypes = [
  "",
  "CEDULA DE CIUDADANIA",
  "PASAPORTE",
  "CEDULA DE EXTRANJERIA",
  "TARJETA DE IDENTIDAD"
] as const;

export const userRoles = ["USER", "ADMIN"] as const;

export const userSchema = z.object({
  id: z.number(),
  tipoDocumento: z.enum(documentTypes),
  numeroDocumento: z.string().min(5, "Número de documento debe tener al menos 5 caracteres"),
  nombres: z.string().min(2, "Nombres debe tener al menos 2 caracteres"),
  apellidos: z.string().min(2, "Apellidos debe tener al menos 2 caracteres"),
  genero: z.enum(["M", "F", "O"], {
    required_error: "Género es requerido",
    invalid_type_error: "Género debe ser M, F u O",
  }),
  fechaNacimiento: z.date(),
  telefono: z.string().min(7, "Teléfono debe tener al menos 7 caracteres"),
  direccion: z.string().min(5, "Dirección debe tener al menos 5 caracteres"),
  ciudad: z.string().min(3, "Ciudad debe tener al menos 3 caracteres"),
  ocupacion: z.string().optional(),
  correo: z.string().email("Correo electrónico inválido"),
  password: z.string().min(6, "Contraseña debe tener al menos 6 caracteres"),
  rolNombre: z.enum(userRoles).default("USER"),
  createdAt: z.date(),
  imagenUrl: z.string().optional()
});

export const petSchema = z.object({
  id: z.number(),
  numIdentificacion: z.string(),
  nombre: z.string(),
  raza: z.string(),
  color: z.string(),
  tipo: z.string(),
  edad:z.number(),
  ubicacion: z.string(),
  sexo: z.enum(["Macho", "Hembra"]),
  tamano: z.enum(["Pequeño", "Mediano", "Grande"]),
  estadoSalud: z.string(),
  estadoAdopcion: z.enum(["pendiente", "adoptado", "disponible"]),
  fundacionId: z.number(),
  imagenUrl: z.string().optional(),
  docAdoptante: z.string().nullable(),
  requisitos: z.array(z.string()).min(1, "Debe especificar al menos un requisito"),
  estadosDeSalud: z.array(z.string()).min(1, "Debe especificar al menos un estado de salud"),
  personalidad: z.array(z.string()).min(1, "Debe especificar al menos un rasgo de personalidad"),
});


export const adoptionSchema = z.object({
  id: z.number(),
  petId: z.number(),
  userId: z.number(),
  status: z.enum(["pending", "approved", "rejected"]).default("pending"),
  applicationDate: z.date(),
  notes: z.string().optional()
});

export type User = z.infer<typeof userSchema>;
export type Pet = z.infer<typeof petSchema>;
export type Adoption = z.infer<typeof adoptionSchema>;