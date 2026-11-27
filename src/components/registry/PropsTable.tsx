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
    <div className="hud-frame rounded-none">
      <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-border bg-hud-bar-bg text-hud-bar-fg">
            <th className="px-4 py-2.5 hud-label">Prop</th>
            <th className="px-4 py-2.5 hud-label">Tipo</th>
            <th className="px-4 py-2.5 hud-label">Default</th>
            <th className="px-4 py-2.5 hud-label">Descripción</th>
          </tr>
        </thead>
        <tbody>
          {props.map((p) => (
            <tr key={p.name} className="border-b border-border last:border-0">
              <td className="px-4 py-2.5 align-top">
                <span className="font-mono text-xs text-heading">
                  {p.name}
                </span>
                {p.required && (
                  <span className="ml-1 text-hud-accent" title="Requerida">
                    *
                  </span>
                )}
              </td>
              <td className="px-4 py-2.5 align-top">
                <code className="rounded-none bg-code-bg px-1.5 py-0.5 font-mono text-xs text-heading">
                  {p.type}
                </code>
              </td>
              <td className="px-4 py-2.5 align-top font-mono text-xs text-text">
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
    </div>
  );
}
