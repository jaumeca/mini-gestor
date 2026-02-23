"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabaseClient";

type Estado = "disponible" | "vendido";

type Inmueble = {
  id: number;
  titulo: string;
  precio: number;
  estado: Estado;
};

export default function Page() {
  const [inmuebles, setInmuebles] = useState<Inmueble[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [busyVenderId, setBusyVenderId] = useState<number | null>(null);

  // UI: panel insertar
  const [showAdd, setShowAdd] = useState(false);
  const [newTitulo, setNewTitulo] = useState("");
  const [newPrecio, setNewPrecio] = useState("");

  // UI: panel editar
  const [showEdit, setShowEdit] = useState(false);
  const [selectedId, setSelectedId] = useState<number | "">("");
  const selectedInmueble = useMemo(
    () => inmuebles.find((i) => i.id === selectedId) ?? null,
    [inmuebles, selectedId]
  );

  const [editPrecio, setEditPrecio] = useState<string>("");
  const [editEstado, setEditEstado] = useState<Estado>("disponible");

  async function fetchInmuebles() {
    setError(null);
    const { data, error } = await supabase
      .from("inmuebles")
      .select("id,titulo,precio,estado")
      .order("id", { ascending: false });

    if (error) {
      setError(error.message);
      return;
    }

    setInmuebles((data ?? []) as Inmueble[]);
  }

  useEffect(() => {
    fetchInmuebles();
  }, []);

  // precarga valores en el panel de edición
  useEffect(() => {
    if (!selectedInmueble) return;
    setEditPrecio(String(selectedInmueble.precio));
    setEditEstado(selectedInmueble.estado);
  }, [selectedInmueble]);

  async function crearInmueble(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const titulo = newTitulo.trim();
    const precioNum = Number(newPrecio);

    if (!titulo) return setError("El título es obligatorio.");
    if (!Number.isFinite(precioNum) || precioNum < 0) {
      return setError("El precio debe ser un número válido (>= 0).");
    }

    setBusy(true);
    const { error } = await supabase.from("inmuebles").insert({
      titulo,
      precio: precioNum,
      estado: "disponible",
    });
    setBusy(false);

    if (error) return setError(error.message);

    setNewTitulo("");
    setNewPrecio("");
    setShowAdd(false);
    await fetchInmuebles();
  }

  async function guardarEdicion(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (selectedId === "") return setError("Selecciona un inmueble.");

    const precioNum = Number(editPrecio);
    if (!Number.isFinite(precioNum) || precioNum < 0) {
      return setError("El precio debe ser un número válido (>= 0).");
    }

    setBusy(true);
    const { error } = await supabase
      .from("inmuebles")
      .update({ precio: precioNum, estado: editEstado })
      .eq("id", selectedId);
    setBusy(false);

    if (error) return setError(error.message);

    setShowEdit(false);
    setSelectedId("");
    await fetchInmuebles();
  }

  // ✅ NUEVO/RECUPERADO: marcar vendido desde la lista
  async function marcarVendidoDesdeLista(id: number) {
    setError(null);
    setBusyVenderId(id);

    const { error } = await supabase
      .from("inmuebles")
      .update({ estado: "vendido" })
      .eq("id", id);

    setBusyVenderId(null);

    if (error) return setError(error.message);

    await fetchInmuebles();
  }

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-6xl flex gap-6">
        {/* LISTADO (solo lectura + botón vender) */}
        <div className="flex-1 bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-black">Mis Inmuebles</h1>

            <button
              className="rounded-md border px-3 py-1.5 text-sm text-black hover:bg-gray-50 disabled:opacity-50"
              onClick={fetchInmuebles}
              disabled={busy}
            >
              Refrescar
            </button>
          </div>

          {error && (
            <p className="mb-4 rounded border border-red-200 bg-red-50 p-2 text-sm text-black">
              {error}
            </p>
          )}

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
                      onClick={() => marcarVendidoDesdeLista(i.id)}
                      disabled={busyVenderId === i.id || busy}
                      title="Marcar este inmueble como vendido"
                    >
                      {busyVenderId === i.id ? "Guardando..." : "Marcar vendido"}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* BARRA DERECHA */}
        <aside className="w-72 flex flex-col gap-4">
          {/* Botón + panel Añadir */}
          <button
            className="bg-black text-white py-4 rounded-lg shadow hover:opacity-90 disabled:opacity-50"
            onClick={() => {
              setShowAdd((v) => !v);
              setShowEdit(false);
            }}
            disabled={busy}
          >
            {showAdd ? "Cerrar Añadir" : "Añadir inmueble"}
          </button>

          {showAdd && (
            <form
              onSubmit={crearInmueble}
              className="bg-white rounded-lg shadow p-4 border space-y-3"
            >
              <div>
                <label className="block text-sm font-medium mb-1 text-black">
                  Título
                </label>
                <input
                  className="w-full rounded-md border px-3 py-2 text-black"
                  placeholder="Ej. Piso en Gràcia"
                  value={newTitulo}
                  onChange={(e) => setNewTitulo(e.target.value)}
                  disabled={busy}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-black">
                  Precio (€)
                </label>
                <input
                  className="w-full rounded-md border px-3 py-2 text-black"
                  inputMode="decimal"
                  placeholder="Ej. 250000"
                  value={newPrecio}
                  onChange={(e) => setNewPrecio(e.target.value)}
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
          )}

          {/* Botón + panel Editar */}
          <button
            className="bg-black text-white py-4 rounded-lg shadow hover:opacity-90 disabled:opacity-50"
            onClick={() => {
              setShowEdit((v) => !v);
              setShowAdd(false);
            }}
            disabled={busy}
          >
            {showEdit ? "Cerrar Editar" : "Editar inmueble"}
          </button>

          {showEdit && (
            <form
              onSubmit={guardarEdicion}
              className="bg-white rounded-lg shadow p-4 border space-y-3"
            >
              <div>
                <label className="block text-sm font-medium mb-1 text-black">
                  Selecciona inmueble
                </label>
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
                <label className="block text-sm font-medium mb-1 text-black">
                  Precio (€)
                </label>
                <input
                  className="w-full rounded-md border px-3 py-2 text-black"
                  inputMode="decimal"
                  value={editPrecio}
                  onChange={(e) => setEditPrecio(e.target.value)}
                  disabled={busy || selectedId === ""}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-black">
                  Estado
                </label>
                <select
                  className="w-full rounded-md border px-3 py-2 text-black"
                  value={editEstado}
                  onChange={(e) => setEditEstado(e.target.value as Estado)}
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
          )}

          {/* Ayuda */}
          <button
            className="bg-black text-white py-4 rounded-lg shadow hover:opacity-90"
            onClick={() =>
              alert(
                "Ayuda:\n- Añadir inmueble: crea un inmueble disponible.\n- En la lista puedes marcar vendido (solo si está disponible).\n- Editar inmueble: selecciona uno y actualiza precio/estado."
              )
            }
          >
            Ayuda
          </button>
        </aside>
      </div>
    </main>
  );
}