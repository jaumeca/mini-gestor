"use client";

import { useState } from "react";

export function AddInmuebleForm(props: {
  busy: boolean;
  onCreate: (data: { titulo: string; precio: number }) => Promise<void>;
}) {
  const { busy, onCreate } = props;

  const [nombrePropiedad, setNombrePropiedad] = useState("");
  const [precio, setPrecio] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const t = nombrePropiedad.trim();
    const p = Number(precio);

    if (!t) return;
    if (!Number.isFinite(p) || p < 0) return;

    await onCreate({ titulo: t, precio: p });
    setNombrePropiedad("");
    setPrecio("");
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-4 border space-y-3">
      <div>
        <label className="block text-sm font-medium mb-1 text-black">Título</label>
        <input
          className="w-full rounded-md border px-3 py-2 text-black"
          placeholder="Ejemplo: Chalet con piscina"
          value={nombrePropiedad}
          onChange={(e) => setNombrePropiedad(e.target.value)}
          disabled={busy}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-black">Precio (€)</label>
        <input
          className="w-full rounded-md border px-3 py-2 text-black"
          inputMode="decimal"
          placeholder="Ejemplo: 250000"
          value={precio}
          onChange={(e) => setPrecio(e.target.value)}
          disabled={busy}
        />
      </div>

      <button
        type="submit"
        className="w-full rounded-md bg-black text-white py-2 hover:opacity-90 disabled:opacity-50"
        disabled={busy}
      >
        Guardar inmueble
      </button>
    </form>
  );
}