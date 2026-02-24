// Componente lateral con acciones para añadir, editar, crear inmuebles de prueba y borrar todos los inmuebles.

"use client";

import { AddInmuebleForm } from "./AddInmuebleForm";
import { EditInmuebleForm } from "./EditInmuebleForm";
import { crearInmueblesFicticios, borrarTodosInmuebles } from "../lib/inmueblesApi";
import { TEXTO_AYUDA } from "../lib/texto";
import type { Estado, Inmueble } from "../lib/types";

export function SidebarActions(props: {
  inmuebles: Inmueble[];
  busy: boolean;
  showAdd: boolean;
  showEdit: boolean;
  setShowAdd: (v: boolean) => void;
  setShowEdit: (v: boolean) => void;
  onCreate: (data: { titulo: string; precio: number }) => Promise<void>;
  onSaveEdit: (data: { id: number; precio: number; estado: Estado }) => Promise<void>;
}) {
  const {
    inmuebles,
    busy,
    showAdd,
    showEdit,
    setShowAdd,
    setShowEdit,
    onCreate,
    onSaveEdit,
  } = props;

  return (
    <aside className="w-72 flex flex-col gap-4">
      <button
        className="bg-black text-white py-4 rounded-lg shadow hover:opacity-90 disabled:opacity-50"
        onClick={() => {
          setShowAdd(!showAdd);
          setShowEdit(false);
        }}
        disabled={busy}
      >
        {showAdd ? "Cerrar Añadir" : "Añadir inmueble"}
      </button>

      {showAdd && <AddInmuebleForm busy={busy} onCreate={onCreate} />}

      <button
        className="bg-black text-white py-4 rounded-lg shadow hover:opacity-90 disabled:opacity-50"
        onClick={() => {
          setShowEdit(!showEdit);
          setShowAdd(false);
        }}
        disabled={busy}
      >
        {showEdit ? "Cerrar Editar" : "Editar inmueble"}
      </button>

      {showEdit && (
        <EditInmuebleForm inmuebles={inmuebles} busy={busy} onSave={onSaveEdit} />
      )}
      <button
        className="bg-black text-white py-4 rounded-lg shadow hover:opacity-90"
        onClick={() =>
          alert(TEXTO_AYUDA)
        }
      >
        Ayuda
      </button>
      <button
        className="bg-black text-white py-4 rounded-lg shadow hover:opacity-90"
        onClick={async () => {
                await crearInmueblesFicticios({ cantidad: 2 });
                              }
                }
      >
        Crear 2 inmuebles de prueba
      </button>
      <button
        className="bg-black text-white py-4 rounded-lg shadow hover:opacity-90"
        onClick={async () => {
        const confirmado = confirm("¿Seguro que quieres borrar TODOS los inmuebles?");

        if (!confirmado) return;

        await borrarTodosInmuebles();
        }}>
  Borrar todos los inmuebles
</button>
    </aside>
  );
}