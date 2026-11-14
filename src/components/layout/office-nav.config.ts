import {
  FileText,
  FolderKanban,
  LayoutDashboard,
  Users,
  type LucideIcon,
} from "lucide-react";

export interface OfficeNavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export const OFFICE_NAV_ITEMS: OfficeNavItem[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/projects",
    label: "Project & Area",
    icon: FolderKanban,
  },
  {
    href: "/reports",
    label: "Laporan Harian",
    icon: FileText,
  },
  {
    href: "/members",
    label: "Anggota Tim",
    icon: Users,
  },
];
