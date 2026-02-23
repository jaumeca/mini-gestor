"use client";

import { useEffect, useMemo, useState } from "react";
import type { Estado, Inmueble } from "../lib/types";

export function EditInmuebleForm(props: {
  inmuebles: Inmueble[];
  busy: boolean;
  onSave: (data: { id: number; precio: number; estado: Estado }) => Promise<void>;
}) {
  const { inmuebles, busy, onSave } = props;

  const [selectedId, setSelectedId] = useState<number | "">("");
  const selected = useMemo(
    () => inmuebles.find((i) => i.id === selectedId) ?? null,
    [inmuebles, selectedId]
  );

  const [precio, setPrecio] = useState("");
  const [estado, setEstado] = useState<Estado>("disponible");

  useEffect(() => {
    if (!selected) return;
    setPrecio(String(selected.precio));
    setEstado(selected.estado);
  }, [selected]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (selectedId === "") return;

    const p = Number(precio);
    if (!Number.isFinite(p) || p < 0) return;

    await onSave({ id: selectedId, precio: p, estado });
    setSelectedId("");
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-4 border space-y-3">
      <div>
        <label className="block text-sm font-medium mb-1 text-black">Selecciona inmueble</label>
        <select
          className="w-full rounded-md border px-3 py-2 text-black"
          value={selectedId}
          onChange={(e) => {
            const v = e.target.value;
            setSelectedId(v === "" ? "" : Number(v));
          }}
          disabled={busy}
        >
          <option value="">-- Elige uno --</option>
          {inmuebles.map((i) => (
            <option key={i.id} value={i.id}>
              {i.titulo} (ID: {i.id})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-black">Precio (€)</label>
        <input
          className="w-full rounded-md border px-3 py-2 text-black"
          inputMode="decimal"
          value={precio}
          onChange={(e) => setPrecio(e.target.value)}
          disabled={busy || selectedId === ""}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-black">Estado</label>
        <select
          className="w-full rounded-md border px-3 py-2 text-black"
          value={estado}
          onChange={(e) => setEstado(e.target.value as Estado)}
          disabled={busy || selectedId === ""}
        >
          <option value="disponible">disponible</option>
          <option value="vendido">vendido</option>
        </select>
      </div>

      <button
        type="submit"
        className="w-full rounded-md bg-black text-white py-2 hover:opacity-90 disabled:opacity-50"
        disabled={busy || selectedId === ""}
      >
        Guardar cambios
      </button>
    </form>
  );
}