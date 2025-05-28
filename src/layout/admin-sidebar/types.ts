
import { LucideIcon } from "lucide-react";

export interface MenuItem {
  title: string;
  href: string;
  icon: LucideIcon;
  gradient: string;
}

export interface MenuGroup {
  title: string;
  items: MenuItem[];
}
