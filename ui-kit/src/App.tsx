import { useState } from "react";
import { Button } from "./components/Button";
import { Input } from "./components/Input";
import { Modal } from "./components/Modal";

export function App() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const error = email && !email.includes("@") ? "Enter a valid email." : undefined;

  return (
    <main className="mx-auto flex max-w-xl flex-col gap-6 p-4 sm:p-8">
      <h1 className="text-2xl font-bold">UI Kit</h1>

      <section className="flex flex-wrap gap-2" aria-label="Buttons">
        <Button>Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="danger">Danger</Button>
        <Button loading>Saving</Button>
      </section>

      <section aria-label="Input">
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={error}
        />
      </section>

      <section aria-label="Modal">
        <Button onClick={() => setOpen(true)}>Open modal</Button>
        <Modal open={open} title="Confirm" onClose={() => setOpen(false)}>
          <p className="text-sm">Are you sure?</p>
          <Button className="mt-4" onClick={() => setOpen(false)}>
            Close
          </Button>
        </Modal>
      </section>
    </main>
  );
}
