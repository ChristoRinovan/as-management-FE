import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/PageHeader";

export default function FieldTasksPlaceholderPage() {
  return (
    <div className="space-y-4">
      <PageHeader
        title="Tugas Lapor Hari Ini"
        description="Daftar area yang menjadi tanggung jawab Anda."
      />
      <Card>
        <CardContent className="py-6 text-base text-text-secondary">
          Daftar kartu tugas area dan mesin kunci bertahap akan diimplementasikan pada TASK-06.
        </CardContent>
      </Card>
    </div>
  );
}
