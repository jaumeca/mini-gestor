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
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto flex gap-6">

        {/* LISTADO */}
        <div className="flex-1 bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold mb-6">
            Mis Inmuebles
          </h1>

          {error && (
            <p className="text-red-600 mb-4">{error}</p>
          )}

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
        </div>

        {/* BARRA LATERAL DERECHA */}
        <div className="w-56 flex flex-col gap-4">
          <button className="bg-black text-white py-4 rounded-lg shadow hover:opacity-90">
            Añadir inmueble
          </button>

          <button className="bg-gray-300 py-4 rounded-lg shadow hover:opacity-90">
            Ayuda
          </button>
        </div>

      </div>
    </main>
  );
}