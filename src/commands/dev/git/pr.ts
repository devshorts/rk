import { Command, Flags } from '@oclif/core';
import { Octokit } from '@octokit/rest';
import util from 'util';
import { exec as execNonPromise } from 'child_process';

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
      required: true,
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

    const ticket = branch.split('/')[1];

    const title = `${flags.type}: [${ticket.toUpperCase()}] ${flags.title}`;
    try {
      // Initialize Octokit with GitHub token
      const octokit = new Octokit({
        auth: flags.githubToken || process.env.GITHUB_TOKEN,
      });

      // Get repository information from git config
      const { stdout: remoteUrl } = await this.executeCommand('git config --get remote.origin.url');
      const [owner, repo] = remoteUrl.replace('git@github.com:', '').replace('.git', '').split('/');

      // Create pull request
      const response = await octokit.rest.pulls.create({
        owner,
        repo,
        title: title.trim(),
        body: flags.body,
        base: flags.base.trim(),
        head: branch.trim(),
      });

      this.log(`Pull request created successfully: ${response.data.html_url}`);
    } catch (error) {
      if ((error as any).status == 404) {
        this.error(`Unable to create pull request for branch '${branch}'. Does the branch exist upstream?`);
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
