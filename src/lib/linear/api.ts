import { LinearClient } from '@linear/sdk';
import { Api, CreateTicket, Ticket } from '../model/types';
import { TicketId } from '../git';
import { IssueFilter } from '@linear/sdk/dist/_generated_documents';

export interface LinearConfig {
  issueFilter?: IssueFilter;
}
export class LinearApi implements Api<LinearConfig> {
  constructor(private client: LinearClient, private teamKey?: string) {}

  async listTickets(config: LinearConfig): Promise<Ticket[]> {
    const me = await this.client.viewer;

    const myIssues = await me.assignedIssues({
      filter: config.issueFilter,
      first: 50,
    });

    return myIssues.nodes.map(issue => ({
      id: issue.identifier as TicketId,
      title: issue.title,
      description: issue.description,
      url: issue.url,
    }));
  }

  async createTicket(ticket: CreateTicket): Promise<Ticket> {
    const me = await this.client.viewer;

    const teams = await this.client.teams();
    const team = teams.nodes.find(i => i.key === this.teamKey);
    if (!team?.id) {
      throw new Error('No team found to create issue in');
    }

    const result = await this.client.createIssue({
      teamId: team.id,
      title: ticket.title,
      description: ticket.description,
    });

    const createdTicket = await result.issue;

    if (!createdTicket) {
      throw new Error('Failed to create issue');
    }

    if (ticket.autoAssign) {
      await this.client.updateIssue(createdTicket.id, { assigneeId: me.id });
    }

    return {
      id: createdTicket.identifier as TicketId,
      title: createdTicket.title,
      description: createdTicket.description,
      url: createdTicket.url,
    };
  }
}
