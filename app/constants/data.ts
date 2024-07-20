import { NavItem, SidebarNavItem } from '@/types';

export const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: 'dashboard',
    label: 'Dashboard'
  },
  {
    title: 'Boxes',
    href: '/dashboard/boxes',
    icon: 'box',
    label: 'boxes'
  },
  {
    title: 'Campaigns',
    href: '/dashboard/campaigns',
    icon: 'campaign',
    label: 'boxes'
  },
  {
    title: 'Company Users',
    href: '/dashboard/users',
    icon: 'employee',
    label: 'employee'
  },
  {
    title: 'API Keys',
    href: '/dashboard/api-keys',
    icon: 'key',
    label: 'keys'
  },
  {
    title: 'Box Allocations',
    href: '/dashboard/box-allocations',
    icon: 'box_allocation',
    label: 'box_allocation'
  },
  {
    title: 'Company Profile',
    href: '/dashboard/profile',
    icon: 'profile',
    label: 'profile'
  },
  {
    title: 'Settings',
    href: '/dashboard/settings',
    icon: 'settings',
    label: 'settings'
  },
];

export const adminNavItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: 'dashboard',
    label: 'Dashboard'
  },
  {
    title: 'Boxes',
    href: '/admin/boxes',
    icon: 'box',
    label: 'boxes'
  },
  {
    title: 'Box Category',
    href: '/admin/box-category',
    icon: 'box',
    label: 'boxes'
  },
  {
    title: 'Campaigns',
    href: '/admin/campaigns',
    icon: 'campaign',
    label: 'campaign'
  },
  {
    title: 'Company',
    href: '/admin/company',
    icon: 'user',
    label: 'company'
  },
  {
    title: 'Company Boxes',
    href: '/admin/company-boxes',
    icon: 'box_allocation',
    label: 'box_allocations'
  },
  {
    title: 'API Keys',
    href: '/admin/api-keys',
    icon: 'key',
    label: 'keys'
  },
  {
    title: 'Gifts',
    href: '/admin/gifts',
    icon: 'gift',
    label: 'gift'
  },
  {
    title: 'Gift Visits',
    href: '/admin/gift-visits',
    icon: 'gift',
    label: 'gift'
  },
  // {
  //   title: 'Notifications',
  //   href: '/admin/notifications',
  //   icon: 'bell',
  //   label: 'notifications'
  // },
  {
    title: 'Permissions',
    href: '/admin/permissions',
    icon: 'lock_icon',
    label: 'permissions'
  },
  {
    title: 'Permission Groups',
    href: '/admin/permission-groups',
    icon: 'group',
    label: 'permission groups'
  },
  {
    title: 'Template',
    href: '/admin/templates',
    icon: 'file',
    label: 'templates'
  },
  {
    title: 'Auth Tokens',
    href: '/admin/tokens/',
    icon: 'key',
    label: 'auth tokens'
  },
  {
    title: 'Config',
    href: '/admin/settings',
    icon: 'settings',
    label: 'settings'
  },
];
