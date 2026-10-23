import { MantineProvider } from "@mantine/core";
import { render } from "@testing-library/react";
import type { RenderOptions } from "@testing-library/react";
import type { ReactElement } from "react";

/** Render dengan provider minimal (Mantine) untuk test komponen. */
export function renderWithProviders(ui: ReactElement, options?: RenderOptions) {
  return render(ui, { wrapper: MantineProvider, ...options });
}
