"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

type Inmueble = {
  id: number;
  titulo: string;
  precio: number;
  estado: "disponible" | "vendido";
};

export default function Page() {
  const [inmuebles, setInmuebles] = useState<Inmueble[]>([]);
  const [titulo, setTitulo] = useState("");
  const [precio, setPrecio] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function fetchInmuebles() {
    const { data, error } = await supabase
      .from("inmuebles")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      setError(error.message);
      return;
    }

    setInmuebles(data as Inmueble[]);
  }

  useEffect(() => {
    fetchInmuebles();
  }, []);

  async function crearInmueble(e: React.FormEvent) {
    e.preventDefault();

    const { error } = await supabase.from("inmuebles").insert({
      titulo,
      precio: Number(precio),
      estado: "disponible",
    });

    if (error) {
      setError(error.message);
      return;
    }

    setTitulo("");
    setPrecio("");
    fetchInmuebles();
  }

  async function marcarVendido(id: number) {
    await supabase
      .from("inmuebles")
      .update({ estado: "vendido" })
      .eq("id", id);

    fetchInmuebles();
  }

  async function actualizarPrecio(id: number, nuevoPrecio: number) {
    await supabase
      .from("inmuebles")
      .update({ precio: nuevoPrecio })
      .eq("id", id);

    fetchInmuebles();
  }

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">MiniGestor Inmobiliario</h1>

      {/* FORM CREAR */}
      <form
        onSubmit={crearInmueble}
        className="mb-6 flex gap-3 items-end"
      >
        <div>
          <label className="block text-sm">Título</label>
          <input
            className="border rounded px-3 py-2"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm">Precio</label>
          <input
            type="number"
            className="border rounded px-3 py-2"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            required
          />
        </div>

        <button className="bg-black text-white px-4 py-2 rounded">
          Añadir
        </button>
      </form>

      {error && (
        <p className="text-red-600 mb-4">{error}</p>
      )}

      {/* LISTADO */}
      <div className="space-y-4">
        {inmuebles.map((i) => (
          <div
            key={i.id}
            className="border rounded p-4 flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">{i.titulo}</p>
              <p className="text-sm text-gray-600">
                {i.precio} € — {i.estado}
              </p>
            </div>

            <div className="flex gap-2 items-center">
              <input
                type="number"
                defaultValue={i.precio}
                className="border px-2 py-1 rounded w-24"
                onBlur={(e) =>
                  actualizarPrecio(i.id, Number(e.target.value))
                }
              />

              {i.estado === "disponible" && (
                <button
                  onClick={() => marcarVendido(i.id)}
                  className="bg-blue-600 text-white px-3 py-1 rounded"
                >
                  Marcar vendido
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}