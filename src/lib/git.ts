import { Brand, notNullOrUndefined } from '@paradoxical-io/types';
import _ from 'lodash';
import { exec as execNonPromise } from 'child_process';
import util from 'util';

const exec = util.promisify(execNonPromise);

export type TicketId = Brand<string, 'ShortcutTicket'>;

export function branchToTicket(name: string): TicketId | undefined {
  const ticket = name.split('/')[1]?.toLowerCase()?.replace(/sc-/g, '');

  if(_.isEmpty(ticket)) {
    return undefined;
  }

  return ticket as TicketId
}

export interface GitBranch {
  ticket: TicketId;
  branch: string;
}

export async function gitBranchTickets(): Promise<Array<GitBranch>> {
  const branches = (
    await exec("git for-each-ref --sort=-committerdate refs/heads/ --format='%(refname:short)'")
  ).stdout.split('\n');

  return branches.map((branch: string) => {
    if (branch.length <= 0) {
      return undefined;
    }

    const ticket = branchToTicket(branch);

    if (_.isNil(ticket)) {
      return undefined;
    }

    return { ticket, branch };
  }).filter(notNullOrUndefined);
}
