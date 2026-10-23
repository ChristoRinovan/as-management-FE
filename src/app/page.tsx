"use client";

/*
 * SCAFFOLD PENGEMBANGAN — BUKAN UI PRODUK.
 * Halaman sementara untuk memverifikasi bahwa fondasi (token desain,
 * provider, primitif UI) berjalan. Keputusan layout, navigasi, dashboard,
 * dan layar bisnis aplikasi laporan keuangan BELUM dibuat — halaman ini
 * akan dihapus/diganti setelah kebutuhan produk disepakati.
 */

import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Checkbox } from "@/components/ui/Checkbox";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { LoadingState } from "@/components/ui/LoadingState";
import { Modal } from "@/components/ui/Modal";
import { Radio } from "@/components/ui/Radio";
import { Select } from "@/components/ui/Select";
import { Separator } from "@/components/ui/Separator";
import { Textarea } from "@/components/ui/Textarea";
import { Tooltip } from "@/components/ui/Tooltip";

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-base font-semibold text-ink">{children}</h2>;
}

export default function HomePage() {
  const [modalOpened, setModalOpened] = useState(false);

  return (
    <main className="mx-auto max-w-2xl space-y-6 p-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold text-ink">Fondasi frontend — scaffold sementara</h1>
        <p className="text-sm text-ink-soft">
          Halaman ini hanya untuk memverifikasi build. Tata letak, navigasi, dan layar aplikasi
          laporan keuangan belum ditentukan.
        </p>
      </header>

      <Separator />

      <section className="space-y-3">
        <SectionTitle>Button</SectionTitle>
        <div className="flex flex-wrap items-center gap-2">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button size="sm">Small</Button>
          <Button loading>Memuat</Button>
          <Button disabled>Nonaktif</Button>
        </div>
      </section>

      <section className="space-y-3">
        <SectionTitle>Badge</SectionTitle>
        <div className="flex flex-wrap gap-2">
          <Badge>Neutral</Badge>
          <Badge tone="info">Info</Badge>
          <Badge tone="success">Success</Badge>
          <Badge tone="warning">Warning</Badge>
          <Badge tone="danger">Danger</Badge>
        </div>
      </section>

      <section className="space-y-3">
        <SectionTitle>Form</SectionTitle>
        <div className="space-y-4">
          <Field label="Contoh label" description="Deskripsi opsional.">
            {(props) => <Input placeholder="Isi teks" {...props} />}
          </Field>
          <Field label="Contoh text area" required>
            {(props) => <Textarea placeholder="Isi deskripsi" {...props} />}
          </Field>
          <Field label="Contoh select">
            {(props) => (
              <Select
                placeholder="Pilih salah satu"
                data={["Opsi A", "Opsi B", "Opsi C"]}
                {...props}
              />
            )}
          </Field>
          <Field label="Contoh dengan error" error="Contoh pesan validasi dalam Bahasa Indonesia.">
            {(props) => <Input placeholder="Isi teks" {...props} />}
          </Field>
          <Checkbox label="Contoh checkbox" />
          <div className="space-y-1.5">
            <Radio name="contoh-radio" value="a" label="Pilihan A" defaultChecked />
            <Radio name="contoh-radio" value="b" label="Pilihan B" />
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <SectionTitle>Card, Tooltip, Modal</SectionTitle>
        <Card>
          <div className="space-y-3">
            <p className="text-sm text-ink">
              Kartu permukaan dengan radius dan shadow dari token desain.
            </p>
            <div className="flex gap-2">
              <Tooltip label="Contoh tooltip">
                <Button variant="outline" size="sm">
                  Arahkan kursor
                </Button>
              </Tooltip>
              <Button size="sm" onClick={() => setModalOpened(true)}>
                Buka modal
              </Button>
            </div>
          </div>
        </Card>
        <Modal
          opened={modalOpened}
          onClose={() => setModalOpened(false)}
          title="Contoh modal"
        >
          <p className="text-sm text-ink-soft">
            Modal dipakai untuk dialog dan konfirmasi. Isi kontennya menyesuaikan kebutuhan
            fitur.
          </p>
        </Modal>
      </section>

      <section className="space-y-3">
        <SectionTitle>State async</SectionTitle>
        <div className="space-y-4">
          <LoadingState />
          <EmptyState />
          <ErrorState onRetry={() => undefined} />
        </div>
      </section>
    </main>
  );
}
