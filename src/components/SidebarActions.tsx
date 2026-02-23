"use client";

import { AddInmuebleForm } from "./AddInmuebleForm";
import { EditInmuebleForm } from "./EditInmuebleForm";
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
          alert(
            "Ayuda:\n- Añadir inmueble: crea un inmueble disponible.\n- En la lista puedes marcar vendido.\n- Editar inmueble: selecciona uno y actualiza precio/estado."
          )
        }
      >
        Ayuda
      </button>
    </aside>
  );
}