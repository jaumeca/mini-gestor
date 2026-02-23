import { supabase } from "./supabaseClient";
import type { Estado, Inmueble } from "./types";

export async function getInmuebles(): Promise<Inmueble[]> {
  const { data, error } = await supabase
    .from("inmuebles")
    .select("id,titulo,precio,estado")
    .order("id", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as Inmueble[];
}

export async function createInmueble(params: { titulo: string; precio: number }) {
  const { error } = await supabase.from("inmuebles").insert({
    titulo: params.titulo,
    precio: params.precio,
    estado: "disponible",
  });

  if (error) throw new Error(error.message);
}

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

export async function markAsSold(id: number) {
  const { error } = await supabase
    .from("inmuebles")
    .update({ estado: "vendido" })
    .eq("id", id);

  if (error) throw new Error(error.message);
}