import { BoxColumn } from '@/(routes)/dashboard/(company_dashboard)/components/box-columns';
import { GiftBoxColumn } from '@/(routes)/dashboard/(gifter_dashboard)/components/columns-gift-received';
import { Icons } from '@/components/icons';
import { NavItem, SidebarNavItem } from '@/types';

export type User = {
  id: number;
  name: string;
  company: string;
  role: string;
  verified: boolean;
  status: string;
};
export const users: User[] = [
  {
    id: 1,
    name: 'Candice Schiner',
    company: 'Dell',
    role: 'Frontend Developer',
    verified: false,
    status: 'Active'
  },
  {
    id: 2,
    name: 'John Doe',
    company: 'TechCorp',
    role: 'Backend Developer',
    verified: true,
    status: 'Active'
  },
  {
    id: 3,
    name: 'Alice Johnson',
    company: 'WebTech',
    role: 'UI Designer',
    verified: true,
    status: 'Active'
  },
  {
    id: 4,
    name: 'David Smith',
    company: 'Innovate Inc.',
    role: 'Fullstack Developer',
    verified: false,
    status: 'Inactive'
  },
  {
    id: 5,
    name: 'Emma Wilson',
    company: 'TechGuru',
    role: 'Product Manager',
    verified: true,
    status: 'Active'
  },
  {
    id: 6,
    name: 'James Brown',
    company: 'CodeGenius',
    role: 'QA Engineer',
    verified: false,
    status: 'Active'
  },
  {
    id: 7,
    name: 'Laura White',
    company: 'SoftWorks',
    role: 'UX Designer',
    verified: true,
    status: 'Active'
  },
  {
    id: 8,
    name: 'Michael Lee',
    company: 'DevCraft',
    role: 'DevOps Engineer',
    verified: false,
    status: 'Active'
  },
  {
    id: 9,
    name: 'Olivia Green',
    company: 'WebSolutions',
    role: 'Frontend Developer',
    verified: true,
    status: 'Active'
  },
  {
    id: 10,
    name: 'Robert Taylor',
    company: 'DataTech',
    role: 'Data Analyst',
    verified: false,
    status: 'Active'
  }
];

export type Employee = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  gender: string;
  date_of_birth: string; // Consider using a proper date type if possible
  street: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
  longitude?: number; // Optional field
  latitude?: number; // Optional field
  job: string;
  profile_picture?: string | null; // Profile picture can be a string (URL) or null (if no picture)
};

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
];

export const mockData: BoxColumn[] = [
  {
    user: 1,
    owner: "John Doe",
    days_of_gifting: "12",
    box_campaign: 101,
    box_campaign_deleted_status: false,
    id: "box-001",
    created_at: "2024-01-01T08:00:00Z",
    updated_at: "2024-02-01T09:00:00Z",
    title: "Holiday Special",
    receiver_name: "Jane Smith",
    receiver_email: "jane.smith@example.com",
    receiver_phone: "123-456-7890",
    open_date: "2024-02-14T10:00:00Z",
    last_opened: null,
    is_setup: true,
    is_company_setup: true,
    open_after_a_day: false,
  },
  {
    user: 2,
    owner: "Alice Johnson",
    days_of_gifting: "5",
    box_campaign: 102,
    box_campaign_deleted_status: true,
    id: "box-002",
    created_at: "2024-03-15T12:00:00Z",
    updated_at: "2024-04-10T13:00:00Z",
    title: "Spring Surprise",
    receiver_name: "Bob Brown",
    receiver_email: "bob.brown@example.com",
    receiver_phone: "987-654-3210",
    open_date: "2024-05-01T14:00:00Z",
    last_opened: null,
    is_setup: false,
    is_company_setup: false,
    open_after_a_day: true,
  },
  {
    user: 3,
    owner: "Charlie Davis",
    days_of_gifting: "7",
    box_campaign: 103,
    box_campaign_deleted_status: false,
    id: "box-003",
    created_at: "2024-05-20T15:00:00Z",
    updated_at: "2024-06-25T16:00:00Z",
    title: "Summer Fun",
    receiver_name: "Eve White",
    receiver_email: "eve.white@example.com",
    receiver_phone: "555-555-5555",
    open_date: "2024-07-04T17:00:00Z",
    last_opened: null,
    is_setup: true,
    is_company_setup: true,
    open_after_a_day: false,
  },
  {
    user: 4,
    owner: "David Evans",
    days_of_gifting: "10",
    box_campaign: 104,
    box_campaign_deleted_status: false,
    id: "box-004",
    created_at: "2024-07-30T18:00:00Z",
    updated_at: "2024-08-20T19:00:00Z",
    title: "Autumn Delight",
    receiver_name: "Frank Green",
    receiver_email: "frank.green@example.com",
    receiver_phone: "444-444-4444",
    open_date: "2024-09-15T20:00:00Z",
    last_opened: null,
    is_setup: true,
    is_company_setup: false,
    open_after_a_day: true,
  },
  {
    user: 5,
    owner: "Ella Harris",
    days_of_gifting: "15",
    box_campaign: 105,
    box_campaign_deleted_status: true,
    id: "box-005",
    created_at: "2024-09-10T21:00:00Z",
    updated_at: "2024-10-05T22:00:00Z",
    title: "Winter Wonderland",
    receiver_name: "Grace Lee",
    receiver_email: "grace.lee@example.com",
    receiver_phone: "333-333-3333",
    open_date: "2024-12-01T23:00:00Z",
    last_opened: null,
    is_setup: false,
    is_company_setup: true,
    open_after_a_day: false,
  },
];
