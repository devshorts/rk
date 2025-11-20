import { CliUx, Command, Flags } from '@oclif/core';
import { Octokit } from '@octokit/rest';
import util from 'util';
import { exec as execNonPromise } from 'child_process';
import _ from 'lodash';
import * as fs from 'node:fs';

const exec = util.promisify(execNonPromise);

export default class Pr extends Command {
  static description = 'Open a pull request using GitHub API';

  static examples = [
    `$ rk dev:git:pr --title "fix: [SC-1234] - Update dependencies" --body "Description of changes" --base main --head feature-branch`,
  ];

  static flags = {
    title: Flags.string({
      char: 't',
      description: 'Pull request title',
      required: false,
    }),
    body: Flags.string({
      char: 'b',
      description: 'Pull request description',
      required: false,
    }),
    type: Flags.string({
      char: 'T',
      description: 'Pull request type (e.g., "fix", "feat")',
      options: ['fix', 'feat', 'chore'],
      default: 'fix',
    }),
    base: Flags.string({
      description: 'Base branch',
      default: 'master',
    }),
    githubToken: Flags.string({ required: false }),
  };

  async run() {
    const { flags } = await this.parse(Pr);

    if (flags.githubToken === undefined && !process.env.GITHUB_TOKEN) {
      throw new Error('Github API token is required with PR read/write permissions. Use --token or GITHUB_TOKEN env variable');
    }

    const {stdout: branch} = await this.executeCommand(`git rev-parse --abbrev-ref HEAD`)

    const root = await this.executeCommand('git rev-parse --show-toplevel').then(res => res.stdout);

    const [user, ticket, name] = branch.split('/');

    const contextTitle = flags.title || _.capitalize(name.split("-").join(" "))

    const title = `${flags.type}: [${ticket.toUpperCase()}] ${contextTitle}`;

    await CliUx.ux.confirm(`Create PR: '${title}'`)

    try {
      // Initialize Octokit with GitHub token
      const octokit = new Octokit({
        auth: flags.githubToken || process.env.GITHUB_TOKEN,
      });

      // Get repository information from git config
      const { stdout: remoteUrl } = await this.executeCommand('git config --get remote.origin.url');
      const [owner, repo] = remoteUrl.replace('git@github.com:', '').replace('.git', '').split('/');

      const body = flags.body || await fs.promises.readFile(`${root}/.github/pull_request_template.md`, 'utf-8').catch(() => '');

      // Create pull request
      const response = await octokit.rest.pulls.create({
        owner,
        repo,
        title: title.trim(),
        body,
        base: flags.base.trim(),
        head: branch.trim(),
      });

      this.log(`Pull request created successfully: ${response.data.html_url}`);
    } catch (error) {
      if ((error as any).status == 404) {
        this.error(`Unable to create pull request for branch '${branch}'. Does the branch exist upstream? ${error}`);
      }else {
        this.error(`Failed to create pull request: ${error}`);
      }
    }
  }

  private async executeCommand(command: string): Promise<{ stdout: string; stderr: string }> {
    const { exec } = await import('child_process');
    return new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (error) {
          reject(error);
        }
        resolve({ stdout: stdout.trim(), stderr });
      });
    });
  }
}
