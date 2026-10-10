import { render, screen } from "@testing-library/react";
import { Modal } from "./Modal";

// jsdom does not implement <dialog>; provide the minimum.
beforeAll(() => {
  HTMLDialogElement.prototype.showModal = function () {
    this.setAttribute("open", "");
  };
  HTMLDialogElement.prototype.close = function () {
    this.removeAttribute("open");
    this.dispatchEvent(new Event("close"));
  };
});

describe("Modal", () => {
  it("shows its title and content when open", () => {
    render(
      <Modal open title="Confirm" onClose={() => {}}>
        Are you sure?
      </Modal>,
    );
    expect(screen.getByRole("dialog", { name: "Confirm" })).toBeInTheDocument();
    expect(screen.getByText("Are you sure?")).toBeInTheDocument();
  });

  it("renders no content when closed", () => {
    render(
      <Modal open={false} title="Confirm" onClose={() => {}}>
        Are you sure?
      </Modal>,
    );
    expect(screen.queryByText("Are you sure?")).not.toBeInTheDocument();
  });

  it("calls onClose when the dialog closes", () => {
    const onClose = vi.fn();
    const { rerender } = render(
      <Modal open title="Confirm" onClose={onClose}>
        x
      </Modal>,
    );
    rerender(
      <Modal open={false} title="Confirm" onClose={onClose}>
        x
      </Modal>,
    );
    expect(onClose).toHaveBeenCalled();
  });
});
