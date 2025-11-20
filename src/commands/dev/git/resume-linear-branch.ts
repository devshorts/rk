import { Command, Flags } from '@oclif/core';

import * as util from 'util';
import { exec as execNonPromise } from 'child_process';
import { select } from '@inquirer/prompts';
import _ from 'lodash';
import { GitBranch, gitBranchTickets } from '../../../lib/git';
import { LinearApi } from '../../../lib/linear/api';
import { Ticket } from '../../../lib/model/types';
import { LinearClient } from '@linear/sdk';
import { loadConfig } from '../../../lib/linear/config';

const exec = util.promisify(execNonPromise);

export default class ResumeLinearBranch extends Command {
  static description = 'Resumes linear branches';

  static flags = {
    token: Flags.string({ required: false, default: process.env.LINEAR_API_TOKEN }),
    config: Flags.string({ required: true, default: './linear.config.json' }),
  };

  async run() {
    const { flags } = await this.parse(ResumeLinearBranch);

    const config = await loadConfig(flags.config);

    const api = new LinearApi(new LinearClient({apiKey: flags.token}));

    const tickets = await api.listTickets(config);

    const branches = await this.getBranches(tickets);

    const byTicketId = _.groupBy(branches, x => x.ticket.id.toString());

    const result = await select<{ name: string }>({
      message: 'Resume?',
      choices: Object.keys(byTicketId).map(id => ({
        name: `${byTicketId[id][0].ticket.id} - ${byTicketId[id][0].ticket.title}`,
        value: {
          name: byTicketId[id][0].ticket.id.toString(),
        },
      })),
      loop: false,
    });

    const branch = await select<{ name: string }>({
      message: 'Which branch?',
      choices: byTicketId[result.name].map(branch => ({
        name: branch.git.branch,
        value: {
          name: branch.git.branch,
        },
      })),
      loop: false,
    });

    await exec(`git checkout ${branch.name}`);
  }

  private async getBranches(
    tickets: Ticket[]
  ): Promise<Array<{ ticket: Ticket; git: GitBranch }>> {
    const branches = await gitBranchTickets();

    const pairings = branches.map(branch => {
        if (_.isNil(branch)) {
          return undefined;
        }

        const ticket = tickets.find(ticket => ticket.id.toString() === branch?.ticket);

        if (!_.isNil(ticket)) {
          return { ticket, git: branch! };
        }

        return undefined;
      }
    );

    return _.compact(pairings);
  }
}
