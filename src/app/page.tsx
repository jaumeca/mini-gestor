"use client";

import { useEffect, useState } from "react";
import { InmueblesList } from "../components/InmueblesList";
import { SidebarActions } from "../components/SidebarActions";
import type { Estado, Inmueble } from "../lib/types";
import { createInmueble, getInmuebles, markAsSold, updateInmueble } from "../lib/inmueblesApi";

export default function Page() {
  const [inmuebles, setInmuebles] = useState<Inmueble[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [busy, setBusy] = useState(false);
  const [busyVenderId, setBusyVenderId] = useState<number | null>(null);

  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  async function refresh() {
    setError(null);
    try {
      const data = await getInmuebles();
      setInmuebles(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error desconocido");
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  async function handleCreate(data: { titulo: string; precio: number }) {
    setError(null);
    setBusy(true);
    try {
      await createInmueble(data);
      setShowAdd(false);
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error desconocido");
    } finally {
      setBusy(false);
    }
  }

  async function handleSaveEdit(data: { id: number; precio: number; estado: Estado }) {
    setError(null);
    setBusy(true);
    try {
      await updateInmueble(data);
      setShowEdit(false);
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error desconocido");
    } finally {
      setBusy(false);
    }
  }

  async function handleMarkSold(id: number) {
    setError(null);
    setBusyVenderId(id);
    try {
      await markAsSold(id);
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error desconocido");
    } finally {
      setBusyVenderId(null);
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-6xl flex gap-6">
        <div className="flex-1">
          {error && (
            <p className="mb-4 rounded border border-red-200 bg-red-50 p-2 text-sm text-black">
              {error}
            </p>
          )}

          <InmueblesList
            inmuebles={inmuebles}
            busy={busy}
            busyVenderId={busyVenderId}
            onRefresh={refresh}
            onMarkSold={handleMarkSold}
          />
        </div>

        <SidebarActions
          inmuebles={inmuebles}
          busy={busy}
          showAdd={showAdd}
          showEdit={showEdit}
          setShowAdd={setShowAdd}
          setShowEdit={setShowEdit}
          onCreate={handleCreate}
          onSaveEdit={handleSaveEdit}
        />
      </div>
    </main>
  );
}