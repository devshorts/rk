import { Command } from '@oclif/core';

import * as util from 'util';
import { exec as execNonPromise } from 'child_process';
import { select } from '@inquirer/prompts';
import _ from 'lodash';

const exec = util.promisify(execNonPromise);

export default class ResumeShortcutBranch extends Command {
  static description = 'Resumes shortcut branches';

  static flags = {};

  async run() {
    const { } = await this.parse(ResumeShortcutBranch);

    const branches = (
      await exec("git for-each-ref --sort=-committerdate refs/heads/ --format='%(refname:short)'")
    ).stdout
      .split('\n')
      .filter((branch: string) => {
        if (branch.length <= 0) {
          return false;
        }

        const ticket = branch.split('/')[2];

        return !_.isUndefined(ticket);
      });

    const result = await select<{ name: string }>({
      message: 'Resume?',
      choices: branches.map((branch: string) => ({
        name: branch,
        value: {
          name: branch,
        },
      })),
      loop: false,
    });

    await exec(`git checkout ${result.name}`);
  }
}
