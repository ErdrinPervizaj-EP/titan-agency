/**
 * Sample data for the TitanDesk replica on the marketing site. Invented,
 * clearly generic, and never loaded from a real workspace.
 */
export type Priority = 'Critical' | 'High' | 'Medium' | 'Low';
export type Status = 'New' | 'Open' | 'Pending' | 'Resolved';

export interface SampleTicket {
  number: number;
  subject: string;
  customer: string;
  priority: Priority;
  status: Status;
  assignee: string | null;
  sla: string;
}

export const TICKETS: SampleTicket[] = [
  { number: 148, subject: 'VPN drops at the branch office', customer: 'Harbor Logistics', priority: 'High', status: 'Open', assignee: 'Arta Krasniqi', sla: 'in 1h 12m' },
  { number: 147, subject: 'Core switch port flapping', customer: 'Northwind Dental', priority: 'Critical', status: 'New', assignee: null, sla: 'in 24m' },
  { number: 146, subject: 'New starter needs a laptop', customer: 'Lumen Studio', priority: 'Medium', status: 'Open', assignee: 'Dren Berisha', sla: 'in 5h' },
  { number: 145, subject: 'Backup job failed overnight', customer: 'Harbor Logistics', priority: 'High', status: 'Pending', assignee: 'Arta Krasniqi', sla: 'Paused' },
  { number: 144, subject: 'Reset MFA for front desk', customer: 'Northwind Dental', priority: 'Medium', status: 'Open', assignee: 'Elira Hoxha', sla: 'in 3h' },
  { number: 143, subject: 'Printer offline on floor 2', customer: 'Lumen Studio', priority: 'Low', status: 'Resolved', assignee: 'Dren Berisha', sla: 'Met' },
  { number: 142, subject: 'Firewall rule review for audit', customer: 'Kodra Legal', priority: 'Medium', status: 'Open', assignee: 'Elira Hoxha', sla: 'in 1d' },
];

export const CUSTOMERS = [
  { name: 'Harbor Logistics', type: 'Company', plan: 'Managed IT', open: 3, devices: 48 },
  { name: 'Northwind Dental', type: 'Company', plan: 'Support', open: 2, devices: 19 },
  { name: 'Lumen Studio', type: 'Company', plan: 'Support', open: 1, devices: 12 },
  { name: 'Kodra Legal', type: 'Company', plan: 'Network', open: 1, devices: 27 },
];

export const DEVICES = [
  { name: 'CORE-SW-01', model: 'Cisco Catalyst 9300', site: 'Head office', status: 'Online' as const },
  { name: 'FW-EDGE-01', model: 'Fortinet FortiGate 60F', site: 'Head office', status: 'Online' as const },
  { name: 'AP-FLOOR-2', model: 'Ubiquiti U6 Pro', site: 'Branch office', status: 'Online' as const },
  { name: 'SW-BRANCH-01', model: 'MikroTik CRS326', site: 'Branch office', status: 'Degraded' as const },
  { name: 'NAS-BACKUP', model: 'Synology RS1221+', site: 'Head office', status: 'Online' as const },
];

export const PROJECT_COLUMNS = [
  { title: 'To do', cards: ['Replace branch office switch', 'Document VLAN plan'] },
  { title: 'In progress', cards: ['Migrate mail to Microsoft 365', 'Roll out new laptops'] },
  { title: 'Done', cards: ['Firewall firmware update'] },
];

/** Tickets per day for the last 12 days — drawn as the dot-matrix chart. */
export const VOLUME = [4, 7, 5, 9, 6, 11, 8, 5, 12, 9, 7, 10];

export const PRIORITY_COLOR: Record<Priority, string> = {
  Critical: '#D92D20',
  High: '#DEA50B',
  Medium: '#4165B7',
  Low: '#475569',
};
