import { useId } from "react";
import type { ReactNode } from "react";

export interface FieldControlProps {
  id: string;
  "aria-describedby": string | undefined;
  "aria-invalid": boolean | undefined;
}

export interface FieldProps {
  label: string;
  required?: boolean;
  description?: string | null;
  /** Pesan validasi (Bahasa Indonesia). Saat terisi, kontrol diberi aria-invalid. */
  error?: string | null;
  /** Render control; terima prop a11y yang sudah dihubungkan ke label/error. */
  children: (control: FieldControlProps) => ReactNode;
}

/**
 * Pembungkus field form: label + deskripsi + pesan validasi dengan
 * pemetaan `htmlFor`/`aria-describedby` yang benar ke kontrol (render prop).
 * Sengaja render-prop supaya tetap netral terhadap library form apa pun.
 */
export function Field({ label, required = false, description, error, children }: FieldProps) {
  const id = useId();
  const descriptionId = `${id}-description`;
  const errorId = `${id}-error`;
  const describedBy =
    [description ? descriptionId : null, error ? errorId : null].filter(Boolean).join(" ") ||
    undefined;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-ink">
        {label}
        {required && (
          <span aria-hidden className="ml-0.5 text-danger">
            *
          </span>
        )}
      </label>
      {description && (
        <p id={descriptionId} className="text-xs text-ink-soft">
          {description}
        </p>
      )}
      {children({
        id,
        "aria-describedby": describedBy,
        "aria-invalid": error ? true : undefined,
      })}
      {error && (
        <p id={errorId} role="alert" className="text-xs text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
