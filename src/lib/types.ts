// Define tipos para el estado y la estructura de un inmueble.

export type Estado = "disponible" | "vendido";

export type Inmueble = {
  id: number;
  titulo: string;
  precio: number;
  estado: Estado;
};