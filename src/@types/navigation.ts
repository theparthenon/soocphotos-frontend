export interface NavigationTree {
  key: string;
  path: string;
  title: string;
  icon: any;
  color: string;
  type?: 'title' | 'collapse' | 'item' | 'divider';
  subMenu?: SubMenuNavigationTree[];
}

export interface SubMenuNavigationTree {
  key: string;
  path?: string;
  title?: string;
  icon?: any;
  color?: string;
  type?: 'title' | 'collapse' | 'item' | 'divider';
}
