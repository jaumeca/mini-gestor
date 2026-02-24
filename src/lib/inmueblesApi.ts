// Pequeña API para gestionar los inmuebles en Supabase
// Principales funciones:
// 1 - crearInmueble(nombre, precio): Crea un nuevo inmueble disponible.
// 2 - updateInmueble(id, precio, estado): Actualiza el precio y estado de un inmueble.
// 3 - marcarComoVendido(id): Cambia el estado de un inmueble a "vendido".
// 4 - crearInmueblesFicticios(cantidad): Crea varios inmuebles con datos aleatorios para pruebas.
// 5 - borrarTodosInmuebles(): Elimina todos los inmuebles de la base de datos.

import { supabase } from "./supabaseClient";
import type { Estado, Inmueble } from "./types";
import { randomEstado, randomPrecio, randomNombrePropiedad } from "./inmueblesRandom";

// Función para obtener todos los inmuebles ordenados por ID descendente
export async function getInmuebles(): Promise<Inmueble[]> {
  const { data, error } = await supabase
    .from("inmuebles")
    .select("id,titulo,precio,estado")
    .order("id", { ascending: false }); // Ordenar por ID descendente para mostrar los más recientes primero (id MAYOR = más reciente).

  if (error) throw new Error(error.message);
  return (data ?? []) as Inmueble[];
}

// Función para crear un nuevo inmueble: el usuario especifica nombre y precio.
export async function crearInmueble(params: { titulo: string; precio: number }) {
  const { error } = await supabase.from("inmuebles").insert({
    titulo: params.titulo,
    precio: params.precio,
    estado: "disponible", // Automáticamente disponible al crear.
  });

  if (error) throw new Error(error.message);
}

// Función para actualizar un inmueble existente: el usuario puede cambiar precio y estado.
export async function updateInmueble(params: {
  id: number;
  precio: number;
  estado: Estado;
}) {
  const { error } = await supabase
    .from("inmuebles")
    .update({ precio: params.precio, estado: params.estado })
    .eq("id", params.id);

  if (error) throw new Error(error.message);
}

// Función para marcar un inmueble como vendido: cambia solo el estado a "vendido".
export async function marcarComoVendido(id: number) {
  const { error } = await supabase
    .from("inmuebles")
    .update({ estado: "vendido" })
    .eq("id", id);

  if (error) throw new Error(error.message);
}

// Usa inmueblesRandom para crear inmuebles con datos aleatorios.
export async function crearInmueblesFicticios(params: { cantidad: number }) {
  const inmuebles = Array.from({ length: params.cantidad }).map(() => ({
    titulo: randomNombrePropiedad(),
    precio: randomPrecio(),
    estado: randomEstado(),
  }));
  const { error } = await supabase
    .from("inmuebles")
    .insert(inmuebles);
  if (error) throw new Error(error.message);
}

// Elimina todos los inmuebles de la base de datos.
export async function borrarTodosInmuebles() {
  const { error } = await supabase
    .from("inmuebles")
    .delete()
    .gt("id", 0);

  if (error) throw new Error(error.message);
}
