// Funciones para generar datos aleatorios de inmuebles: nombres, precios y estados.

import type { Estado } from "./types";

const POSIBLESNOMBRES = [
  "Piso Centro",
  "Ático con terraza",
  "Casa en la playa",
  "Local comercial",
  "Chalet independiente",
  "Estudio reformado",
  "Oficina moderna",
  "Dúplex luminoso",
  "Loft industrial",
  "Apartamento turístico",
  "Casa con piscina",
  "Piso con vistas",
  "Ático en el casco antiguo",
  "Local en zona de paso",
  "Chalet con jardín",
  "Estudio en el centro",
  "Oficina en edificio emblemático",
  "Dúplex con terraza",
  "Loft con encanto",
  "Apartamento cerca del mar",
  "Casa de campo",
  "Club de golf",
  "Piso con garaje",
  "Ático con vistas al mar",
  "Local comercial en zona de ocio",
  "Chalet con vistas panorámicas",
  "Estudio con luz natural",
  "Oficina con espacio de coworking",
  "Dúplex con diseño moderno",
  "Loft en zona de moda",
  "Apartamento con piscina comunitaria",
];

export function randomNombrePropiedad(): string {
  const nuevoNombre = POSIBLESNOMBRES[Math.floor(Math.random() * POSIBLESNOMBRES.length)];
  return nuevoNombre;
}

export function randomPrecio(): number {
  return Math.floor(Math.random() * 1000000); // Precio entre 0 y 1 millón (math.floor para entero), (math.random para decimal entre 0 y 1).
}

export function randomEstado(): Estado {
  return Math.random() > 0.5 ? "disponible" : "vendido";
}