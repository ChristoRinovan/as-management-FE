import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "@/test/test-utils";
import { Button } from "./Button";

describe("Button", () => {
  it("merender label dan menjalankan onClick", () => {
    const onClick = vi.fn();
    renderWithProviders(<Button onClick={onClick}>Simpan</Button>);
    screen.getByRole("button", { name: "Simpan" }).click();
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("menonaktifkan interaksi saat disabled", () => {
    const onClick = vi.fn();
    renderWithProviders(
      <Button disabled onClick={onClick}>
        Nonaktif
      </Button>,
    );
    const button = screen.getByRole("button", { name: "Nonaktif" });
    expect(button).toBeDisabled();
    button.click();
    expect(onClick).not.toHaveBeenCalled();
  });

  it("memiliki accessible name saat loading", () => {
    renderWithProviders(<Button loading>Simpan</Button>);
    expect(screen.getByRole("button", { name: "Simpan" })).toBeDisabled();
  });
});
