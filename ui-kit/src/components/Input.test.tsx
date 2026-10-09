import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Input } from "./Input";

describe("Input", () => {
  it("links the label to the input", async () => {
    render(<Input label="Email" />);
    await userEvent.type(screen.getByLabelText("Email"), "a@b.co");
    expect(screen.getByLabelText("Email")).toHaveValue("a@b.co");
  });

  it("announces an error and links it to the input", () => {
    render(<Input label="Email" error="Enter a valid email." />);
    const input = screen.getByLabelText("Email");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByRole("alert")).toHaveTextContent("Enter a valid email.");
    expect(input).toHaveAccessibleDescription("Enter a valid email.");
  });

  it("has no error markup when valid", () => {
    render(<Input label="Email" />);
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(screen.getByLabelText("Email")).not.toHaveAttribute("aria-invalid");
  });
});
