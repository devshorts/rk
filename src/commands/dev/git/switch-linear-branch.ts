import { Command, Flags } from '@oclif/core';

import { input, select } from '@inquirer/prompts';

import * as util from 'util';
import { exec as execNonPromise } from 'child_process';
import { LinearApi } from '../../../lib/linear/api';
import { BranchTicket, Ticket, UserDetails } from '../../../lib/model/types';
import { LinearClient } from '@linear/sdk';
import { loadConfig } from '../../../lib/linear/config';

const exec = util.promisify(execNonPromise);

export default class SwitchLinearBranch extends Command {
  static description = 'Switches to a branch by a shortcut name';

  static flags = {
    token: Flags.string({ required: false, default: process.env.LINEAR_API_TOKEN }),
    username: Flags.string({ required: true, default: process.env.USER }),
    teamKey: Flags.string({ required: true }),
    config: Flags.string({ required: true, default: './linear.config.json' }),
  };

  async run() {
    const { flags } = await this.parse(SwitchLinearBranch);

    if (flags.token === undefined) {
      throw new Error('Shortcut API token is required. Use --token or LINEAR_API_TOKEN env variable');
    }

    const user: UserDetails = {
      name: flags.username
    }

    const config = await loadConfig(flags.config)

    const api = new LinearApi(new LinearClient({apiKey: flags.token}), flags.teamKey);

    const tickets = await api.listTickets(config)

    const ticket: BranchTicket = await select<BranchTicket>({
      message: 'What are you working on?',
      choices: [{ name: 'New ticket', value: { type: 'new' } as BranchTicket }, ...tickets
        .map((ticket: Ticket) => ({
          name: ticket.title,
          value: {
            type: 'existing',
            title: ticket.title,
            id: ticket.id.toString(),
            url: ticket.url,
          } as BranchTicket,
        }))],
      loop: false,
    });

    try {
      if (ticket.type === 'new') {
        const name = await input({ message: 'Ticket title?' });

        const newTicket = await api.createTicket({
          title: name,
          autoAssign: true
        });

        const branchName = this.ticketBranchName(user, newTicket);

        this.log(`Switching to branch ${branchName} for new ticket ${newTicket.url}`);

        await exec(`git checkout -b ${branchName}`);
      } else {
        const nameOverride: string = await input({ message: 'Branch name?', default: ticket.title });

        const branchName = this.ticketBranchName(user, { ...ticket, title: nameOverride });

        this.log(`Switching to branch ${branchName} for existing ticket ${ticket.url}`);

        await exec(`git checkout -b ${branchName}`);
      }
    } catch (e) {
      this.error(`Error switching to branch: ${e}`);
    }
  }

  private ticketBranchName(user: UserDetails, ticket: Ticket): string {
    const prefix = `${user.name}/${ticket.id}`;

    let name = ticket.title
      .toLowerCase()
      .replace(/[\[\]]/g, '')
      .replace(/\W/g, '-')
      .replace(/--+/, '-')
      .replace(/[^a-z0-9-]/g, '')
      .slice(0, 50)
      .replace(/-$/, '');

    return `${prefix}/${name}`;
  }
}
