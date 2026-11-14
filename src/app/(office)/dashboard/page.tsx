import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/PageHeader";

export default function DashboardPlaceholderPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard Monitoring"
        description="Ringkasan status pelaporan harian project dan area aktif."
      />
      <Card>
        <CardContent className="py-8 text-sm text-text-secondary">
          Modul monitoring KPI, filter cepat, dan export PDF Opsi A akan diimplementasikan pada TASK-08.
        </CardContent>
      </Card>
    </div>
  );
}
