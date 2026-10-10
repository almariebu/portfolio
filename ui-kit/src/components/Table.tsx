import { useMemo, useState, type ReactNode } from "react";

export type Column<T> = {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  /** Return a comparable value to make the column sortable. */
  sortValue?: (row: T) => string | number;
};

export type TableProps<T> = {
  caption: string;
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string | number;
  emptyMessage?: string;
};

type Sort = { key: string; direction: "ascending" | "descending" } | null;

export function Table<T>({
  caption,
  columns,
  rows,
  rowKey,
  emptyMessage = "No data.",
}: TableProps<T>) {
  const [sort, setSort] = useState<Sort>(null);

  const sorted = useMemo(() => {
    const column = columns.find((c) => c.key === sort?.key);
    if (!sort || !column?.sortValue) return rows;
    const value = column.sortValue;
    const factor = sort.direction === "ascending" ? 1 : -1;
    return [...rows].sort((a, b) => {
      const x = value(a);
      const y = value(b);
      return (x < y ? -1 : x > y ? 1 : 0) * factor;
    });
  }, [rows, columns, sort]);

  function toggle(key: string) {
    setSort((current) =>
      current?.key === key && current.direction === "ascending"
        ? { key, direction: "descending" }
        : { key, direction: "ascending" },
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-300">
      <table className="w-full text-left text-sm">
        <caption className="p-3 text-left font-semibold">{caption}</caption>
        <thead className="bg-slate-100">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                aria-sort={sort?.key === column.key ? sort.direction : undefined}
                className="px-3 py-2 font-semibold"
              >
                {column.sortValue ? (
                  <button
                    type="button"
                    onClick={() => toggle(column.key)}
                    className="font-semibold focus-visible:outline-2 focus-visible:outline-blue-600"
                  >
                    {column.header}
                  </button>
                ) : (
                  column.header
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-3 py-4 text-slate-600">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            sorted.map((row) => (
              <tr key={rowKey(row)} className="border-t border-slate-200">
                {columns.map((column) => (
                  <td key={column.key} className="px-3 py-2">
                    {column.render(row)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
