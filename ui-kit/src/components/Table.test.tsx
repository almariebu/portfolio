import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Table, type Column } from "./Table";

type Student = { id: number; name: string; units: number };

const rows: Student[] = [
  { id: 1, name: "Cruz", units: 21 },
  { id: 2, name: "Abad", units: 15 },
  { id: 3, name: "Lim", units: 18 },
];

const columns: Column<Student>[] = [
  { key: "name", header: "Name", render: (r) => r.name, sortValue: (r) => r.name },
  { key: "units", header: "Units", render: (r) => r.units, sortValue: (r) => r.units },
  { key: "id", header: "ID", render: (r) => r.id },
];

function names() {
  return screen
    .getAllByRole("row")
    .slice(1)
    .map((row) => within(row).getAllByRole("cell")[0].textContent);
}

function setup(data = rows) {
  render(
    <Table caption="Students" columns={columns} rows={data} rowKey={(r) => r.id} />,
  );
}

describe("Table", () => {
  it("renders a captioned table with headers and rows", () => {
    setup();
    expect(screen.getByRole("table", { name: "Students" })).toBeInTheDocument();
    expect(screen.getAllByRole("columnheader")).toHaveLength(3);
    expect(names()).toEqual(["Cruz", "Abad", "Lim"]);
  });

  it("sorts ascending, then descending, and sets aria-sort", async () => {
    setup();
    const header = screen.getByRole("columnheader", { name: "Name" });
    await userEvent.click(within(header).getByRole("button"));
    expect(names()).toEqual(["Abad", "Cruz", "Lim"]);
    expect(header).toHaveAttribute("aria-sort", "ascending");
    await userEvent.click(within(header).getByRole("button"));
    expect(names()).toEqual(["Lim", "Cruz", "Abad"]);
    expect(header).toHaveAttribute("aria-sort", "descending");
  });

  it("sorts numbers numerically", async () => {
    setup();
    await userEvent.click(screen.getByRole("button", { name: "Units" }));
    expect(names()).toEqual(["Abad", "Lim", "Cruz"]);
  });

  it("does not make columns without sortValue sortable", () => {
    setup();
    expect(screen.queryByRole("button", { name: "ID" })).not.toBeInTheDocument();
  });

  it("shows an empty message", () => {
    setup([]);
    expect(screen.getByText("No data.")).toBeInTheDocument();
  });
});
