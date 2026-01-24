export interface Project {
  id: string;
  name: string;
  url: string;
  description?: string;
  image?: string;
  icon?: string;
}

export interface NavItem {
  label: string;
  href: string;
}