export interface NavItem {
  title: string;
  href?: string;
  disabled?: boolean;
  label?: string;
}

export interface NavItemWithChildren extends NavItem {
  items?: NavItemWithChildren[];
}