import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "@/test/test-utils";
import { AsyncStateView } from "./AsyncStateView";

describe("AsyncStateView", () => {
  it("menampilkan skeleton saat loading", () => {
    renderWithProviders(
      <AsyncStateView
        data={undefined}
        isLoading
        skeleton={<div data-testid="skeleton">memuat…</div>}
      >
        {() => <p>konten</p>}
      </AsyncStateView>,
    );
    expect(screen.getByTestId("skeleton")).toBeInTheDocument();
    expect(screen.queryByText("konten")).not.toBeInTheDocument();
  });

  it("menampilkan ErrorState dan memanggil onRetry saat retry diklik", () => {
    const onRetry = vi.fn();
    renderWithProviders(
      <AsyncStateView data={undefined} error={new Error("Gagal mengambil data")} onRetry={onRetry}>
        {() => <p>konten</p>}
      </AsyncStateView>,
    );
    expect(screen.getByRole("alert")).toHaveTextContent("Gagal mengambil data");
    screen.getByRole("button", { name: "Coba lagi" }).click();
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it("menampilkan EmptyState saat data kosong", () => {
    renderWithProviders(<AsyncStateView data={[]}>{() => <p>konten</p>}</AsyncStateView>);
    expect(screen.getByText("Belum ada data")).toBeInTheDocument();
    expect(screen.queryByText("konten")).not.toBeInTheDocument();
  });

  it("merender children dengan data saat sukses", () => {
    renderWithProviders(
      <AsyncStateView data={["a", "b"]}>{(items) => <p>konten: {items.join(", ")}</p>}</AsyncStateView>,
    );
    expect(screen.getByText("konten: a, b")).toBeInTheDocument();
  });
});
