import { TicketId } from '../git';

export interface Ticket {
  id: TicketId;
  title: string;
  description?: string;
  url: string;
}

export interface UserDetails {
  name: string
}

export interface CreateTicket extends Omit<Ticket, 'id' | 'url'> {
  autoAssign?: boolean
}

export interface Api {
  listTickets(): Promise<Ticket[]>
  createTicket(ticket: CreateTicket): Promise<Ticket>
}

export interface CreatedBranchTicket {
  type: 'existing';
  title: string;
  id: TicketId;
  url: string;
}

export type BranchTicket =
  | CreatedBranchTicket
  | {
      type: 'new';
    };
