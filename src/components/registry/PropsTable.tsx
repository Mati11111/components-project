import type { PropDef } from "@/registry/types";

export interface PropsTableProps {
  /** Lista de props a documentar. */
  props: PropDef[];
}

export function PropsTable({ props }: PropsTableProps) {
  if (props.length === 0) {
    return (
      <p className="text-sm text-text">
        Este componente no expone props propias.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-border bg-surface">
            <th className="px-4 py-2.5 font-medium text-heading">Prop</th>
            <th className="px-4 py-2.5 font-medium text-heading">Tipo</th>
            <th className="px-4 py-2.5 font-medium text-heading">Default</th>
            <th className="px-4 py-2.5 font-medium text-heading">Descripción</th>
          </tr>
        </thead>
        <tbody>
          {props.map((p) => (
            <tr key={p.name} className="border-b border-border last:border-0">
              <td className="px-4 py-2.5 align-top">
                <span className="font-mono text-[13px] text-heading">
                  {p.name}
                </span>
                {p.required && (
                  <span className="ml-1 text-accent" title="Requerida">
                    *
                  </span>
                )}
              </td>
              <td className="px-4 py-2.5 align-top">
                <code className="rounded bg-code-bg px-1.5 py-0.5 font-mono text-[12px] text-accent">
                  {p.type}
                </code>
              </td>
              <td className="px-4 py-2.5 align-top font-mono text-[13px] text-text">
                {p.default ?? "—"}
              </td>
              <td className="px-4 py-2.5 align-top text-text">
                {p.description ?? "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
