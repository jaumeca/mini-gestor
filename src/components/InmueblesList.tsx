"use client";

import type { Inmueble } from "../lib/types";

export function InmueblesList(props: {
  inmuebles: Inmueble[];
  busy: boolean;
  busyVenderId: number | null;
  onRefresh: () => void;
  onMarkSold: (id: number) => void;
}) {
  const { inmuebles, busy, busyVenderId, onRefresh, onMarkSold } = props;

  return (
    <div className="flex-1 bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-black">Mis Inmuebles</h1>

        <button
          className="rounded-md border px-3 py-1.5 text-sm text-black hover:bg-gray-50 disabled:opacity-50"
          onClick={onRefresh}
          disabled={busy}
        >
          Refrescar
        </button>
      </div>

      <div className="space-y-4">
        {inmuebles.map((i) => (
          <div
            key={i.id}
            className="border rounded p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="font-semibold text-black">{i.titulo}</p>
              <p className="text-sm text-black">
                {i.precio} € — {i.estado}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-sm text-black">ID: {i.id}</div>

              {i.estado === "disponible" && (
                <button
                  className="rounded-md bg-black px-3 py-2 text-sm text-white hover:opacity-90 disabled:opacity-50"
                  onClick={() => onMarkSold(i.id)}
                  disabled={busy || busyVenderId === i.id}
                >
                  {busyVenderId === i.id ? "Guardando..." : "Marcar vendido"}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}