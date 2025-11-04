import { Command, Flags } from '@oclif/core';

import * as util from 'util';
import { exec as execNonPromise } from 'child_process';
import { select } from '@inquirer/prompts';
import _ from 'lodash';
import { GitBranch, gitBranchTickets } from '../../../lib/git';
import { LinearApi } from '../../../lib/linear/api';
import { Api, Ticket } from '../../../lib/model/types';
import { LinearClient } from '@linear/sdk';

const exec = util.promisify(execNonPromise);

export default class ResumeLinearBranch extends Command {
  static description = 'Resumes linear branches';

  static flags = {
    token: Flags.string({ required: false, default: process.env.LINEAR_API_TOKEN }),
  };

  async run() {
    const { flags } = await this.parse(ResumeLinearBranch);

    const api: Api = new LinearApi(new LinearClient({apiKey: flags.token}));

    const tickets = await api.listTickets();

    const branches = await this.getBranches(tickets);

    const byTicketId = _.groupBy(branches, x => x.ticket.id.toString());

    const result = await select<{ name: string }>({
      message: 'Resume?',
      choices: Object.keys(byTicketId).map(id => ({
        name: byTicketId[id][0].ticket.title,
        value: {
          name: byTicketId[id][0].ticket.id.toString(),
        },
      })),
      loop: false,
    });

    const branch = await select<{ name: string }>({
      message: 'Which branch?',
      choices: byTicketId[result.name].map(branch => ({
        name: branch.value.branch,
        value: {
          name: branch.value.branch,
        },
      })),
      loop: false,
    });

    await exec(`git checkout ${branch.name}`);
  }

  private async getBranches(
    tickets: Ticket[]
  ): Promise<Array<{ ticket: Ticket; value: GitBranch }>> {
    const branches = await gitBranchTickets();

    const pairings: Array<
      undefined | { ticket: Ticket; value: GitBranch }
    > = branches.map(value => {
        if (_.isNil(value)) {
          return undefined;
        }

        const ticket = tickets.find(ticket => ticket.id.toString() === value?.ticket);

        if (!_.isNil(ticket)) {
          return { ticket, value: value! };
        }

        return undefined;
      }
    );

    return _.compact(pairings);
  }
}
