export interface NavItem {
  title: string;
  href?: string;
  disabled?: boolean;
  label?: string;
}

export interface NavItemWithChildren extends NavItem {
  items?: NavItemWithChildren[];
}

export interface SidebarNavItem extends NavItemWithChildren {}

export type DashboardConfig = {
  sidebarNav: SidebarNavItem[];
};
