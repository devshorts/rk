import { Command, Flags } from '@oclif/core';

import * as util from 'util';
import { exec as execNonPromise } from 'child_process';
import { branchToTicket } from '../../../lib/git';

const exec = util.promisify(execNonPromise);

export default class OpenLinearBranch extends Command {
  static description = 'Opens a linear ticket for the current branch';

  static flags = {
    token: Flags.string({ required: true, default: process.env.LINEAR_API_TOKEN }),
    baseUrl: Flags.string({ required: true }),
  };

  async run() {
    const { flags } = await this.parse(OpenLinearBranch);

    if (flags.token === undefined) {
      throw new Error('Linear API token is required. Use --token or LINEAR_API_TOKEN env variable');
    }

    const branch = await exec('git rev-parse --abbrev-ref HEAD');

    const ticket = branchToTicket(branch.stdout)

    const url = `https://${flags.baseUrl}/issue/${ticket}`

    await exec(`open ${url}`);

    this.log(`Opening ticket ${url}`);
  }
}
