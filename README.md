# Projek Laporan Keuangan — Fondasi Frontend

Fondasi frontend untuk aplikasi pelaporan pengeluaran terpusat.
Stack mengikuti repository referensi (`FE/`, read-only) dan
`docs/architecture/frontend-coding-conventions.md`: **Next.js App Router + React 19 +
TypeScript strict + Mantine 9 + Tailwind CSS 4 + TanStack Query 5 + Zod 4**, dengan
**Vitest** untuk test (kebijakan baru; referensi tidak punya test).

> **Status**: fondasi. Keputusan UI produk (dashboard, navigasi, layar bisnis, alur
> pengeluaran) **belum dibuat** — menunggu analisis kebutuhan. Halaman di `src/app/page.tsx`
> adalah scaffold sementara untuk verifikasi dan akan diganti saat fitur pertama dibangun.

## Instalasi & Perintah

Prasyarat: Node.js 20+ dan npm.

```bash
npm install          # pasang dependensi
npm run dev          # server pengembangan (http://localhost:3000)
npm run build        # build produksi
npm run start        # jalankan hasil build
npm run lint         # ESLint (flat config)
npm run typecheck    # tsc --noEmit
npm test             # Vitest, sekali jalan
npm run test:watch   # Vitest mode watch
```

Semua perintah di atas wajib lulus sebelum commit (lihat
`docs/architecture/coding-conventions.md` §9).

## Struktur Proyek

```
src/
  app/                  # App Router: layout.tsx (provider global), page.tsx (SCAFFOLD
                        # sementara — bukan UI produk), globals.css (design tokens)
  providers/            # Providers.tsx: MantineProvider + Notifications + QueryClientProvider
  components/
    ui/                 # Primitif UI generik (lihat §UI Primitives) — tanpa logika bisnis
  lib/
    api/axios.ts        # Axios singleton + ApiError (envelope backend) — belum ada endpoint
    theme/theme.ts      # Tema Mantine (default netral yang bisa dikonfigurasi)
  test/test-utils.tsx   # Helper render untuk test komponen
  types/api/index.ts    # Tipe envelope API (ApiResponse, PaginatedResponse, ApiErrorBody)
```

Belum dibuat (sengaja — jangan buat folder kosong spekulatif; tambah saat ada fitur nyata):

- `src/hooks/<domain>.hooks.ts` — wrapper React Query per domain
- `src/lib/api/<domain>.api.ts` — client per domain di atas `apiClient`
- `src/lib/validation/<domain>.validation.ts` — skema Zod berbahasa Indonesia
- `src/features/` atau `src/components/<area>/<feature>/` — modul fitur bisnis

## UI Primitives (`src/components/ui/`)

Semua bertipe, berbasis Mantine, dengan default dari token desain:

| Komponen | Catatan |
| --- | --- |
| `Button` | `variant`: primary/secondary/outline/ghost; `size`: sm/md/lg; `loading`, `disabled` |
| `Input`, `Textarea`, `Select`, `Checkbox`, `Radio` | Wrapper Mantine; `Radio.Group` dipakai langsung dari `@mantine/core` |
| `Field` | Label + deskripsi + pesan validasi dengan wiring a11y (render prop menerima `id`/`aria-*`) |
| `Card` | Permukaan default: border + shadow dari token |
| `Badge` | `tone`: neutral/info/success/warning/danger (palet Mantine) |
| `Separator`, `Tooltip` | Alias tipis Divider/Tooltip Mantine — jangan implementasi ulang |
| `Modal` | Dialog terpusat; prop Mantine lain (`title`, `size`, dst.) tetap tersedia |
| `LoadingState`, `EmptyState`, `ErrorState` | Pesan default Bahasa Indonesia |
| `AsyncStateView` | Gerbang wajib semua list/detail: loading → error → kosong → konten |

Layout (Container/Stack/Group/Grid) memakai komponen Mantine apa adanya —
tidak ada wrapper sendiri agar tidak menduplikasi.

### Contoh pemakaian

```tsx
<AsyncStateView
  data={data}
  isLoading={isPending}
  error={error}
  onRetry={refetch}
  empty={{ title: "Belum ada data" }}
>
  {(items) => <ul>{items.map((item) => <li key={item.id}>{item.name}</li>)}</ul>}
</AsyncStateView>
```

```tsx
<Field label="Nama" required error={errors.name}>
  {(props) => <Input {...props} value={name} onChange={(e) => setName(e.currentTarget.value)} />}
</Field>
```

## Design Tokens (`src/app/globals.css`)

Token didefinisikan **hanya** di `@theme static` (Tailwind 4) sehingga:

- tersedia sebagai utility: `bg-surface`, `text-ink`, `border-border`, `rounded-md`, `shadow-sm`, dll;
- tersedia langsung sebagai CSS variable: `var(--color-primary)`, `var(--radius-lg)`;
- diganti **di satu tempat** saat identitas visual ditetapkan — bukan di komponen.

Kelompok token: permukaan (`canvas`/`surface`/`border`), teks (`ink`/`ink-soft`),
primer (`primary`/`primary-strong`/`primary-soft`/`on-primary`), status
(`success`/`warning`/`danger` + varian `-soft`), radius, shadow.
Nilai sekarang adalah **default netral yang diselaraskan dengan palet biru Mantine** —
bukan brand produk. Tipografi & spacing memakai skala bawaan Tailwind; gelap mode
belum dirancang.

## Konvensi (ringkas — detail di `docs/architecture/`)

- **Alur data**: `lib/api/<domain>.api.ts` (class client di atas `apiClient`) →
  `hooks/<domain>.hooks.ts` (React Query: konstanta query key, invalidate, notifikasi) →
  komponen. Komponen tidak memanggil axios langsung.
- **Error API**: interceptor `lib/api/axios.ts` menerjemahkan envelope gagal menjadi
  `ApiError` (`code`, `message`, `fields?`). Bandingkan `code`, bukan pesan teks.
- **Validasi**: skema Zod di `src/lib/validation/`, pesan berbahasa Indonesia; server
  tetap otoritas.
- **Nama file**: komponen React PascalCase; `*.hooks.ts`, `*.api.ts`, `*.validation.ts`,
  `*.types.ts` kebab-case; tanpa spasi; identifier code bahasa Inggris, pesan user
  bahasa Indonesia.
- **Test**: Vitest berdampingan dengan file yang diuji (`*.test.ts(x)`); uji perilaku
  (render → interaksi → expect), bukan implementasi internal; tanpa `.skip`.
  Gunakan `renderWithProviders` dari `src/test/test-utils.tsx` untuk komponen Mantine.
- **Waktu** selalu WIB (`Asia/Jakarta`); **uang** rupiah disimpan sebagai number integer
  dan diformat hanya di tampilan (`Intl.NumberFormat("id-ID", …)`).
- **Conventional Commits**: `feat(scope): …`, `fix(scope): …`, `test: …`.

## Env & Secret

- Frontend hanya boleh membaca env dengan prefix `NEXT_PUBLIC_`:
  - `NEXT_PUBLIC_API_URL` — base URL backend (default `/api`).
- **Jangan pernah** commit `.env` atau nilai secret; env dibaca lewat variabel runtime,
  bukan hardcode di kode.

## Cara Menambah Fitur (setelah kebutuhan disepakati)

1. Tipe API: `src/types/api/<domain>.types.ts`, export lewat barrel `index.ts`.
2. Client: `src/lib/api/<domain>.api.ts` (class di atas `apiClient`, unwrap envelope `res.data.data`).
3. Hooks: `src/hooks/<domain>.hooks.ts` (query key konstanta, invalidate + notifikasi saat mutation).
4. Validasi: `src/lib/validation/<domain>.validation.ts` (Zod, pesan Indonesia).
5. UI: komponen di `src/components/<area>/<feature>/` (PascalCase, `*Content` sebagai
   orchestrator per halaman); route groups per segmen pengguna di `src/app/`.
6. Semua list/detail melewati `AsyncStateView`; form = Mantine `useForm` + skema Zod.
7. Test berdampingan dengan file; `npm run lint && npm run typecheck && npm test && npm run build` wajib lulus.
