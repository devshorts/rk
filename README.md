rk
=================

Command line tools.

Build with `yarn install && yarn build && yarn finalize`

For autocomplete integration run:

```bash
rk autocomplete:script zsh
```

<!-- toc -->
* [Commands](#commands)
<!-- tocstop -->
# Commands
<!-- commands -->
* [`rk autocomplete [SHELL]`](#rk-autocomplete-shell)
* [`rk dev:git:open-linear-branch`](#rk-devgitopen-linear-branch)
* [`rk dev:git:pr`](#rk-devgitpr)
* [`rk dev:git:resume-linear-branch`](#rk-devgitresume-linear-branch)
* [`rk dev:git:switch-linear-branch`](#rk-devgitswitch-linear-branch)
* [`rk help [COMMAND]`](#rk-help-command)

## `rk autocomplete [SHELL]`

display autocomplete installation instructions

```
USAGE
  $ rk autocomplete [SHELL] [-r]

ARGUMENTS
  SHELL  shell type

FLAGS
  -r, --refresh-cache  Refresh cache (ignores displaying instructions)

DESCRIPTION
  display autocomplete installation instructions

EXAMPLES
  $ rk autocomplete

  $ rk autocomplete bash

  $ rk autocomplete zsh

  $ rk autocomplete --refresh-cache
```

_See code: [@oclif/plugin-autocomplete](https://github.com/oclif/plugin-autocomplete/blob/v0.2.1/src/commands/autocomplete/index.ts)_

## `rk dev:git:open-linear-branch`

Opens a linear ticket for the current branch

```
USAGE
  $ rk dev:git:open-linear-branch --token <value> --baseUrl <value>

FLAGS
  --baseUrl=<value>  (required)
  --token=<value>    (required)

DESCRIPTION
  Opens a linear ticket for the current branch
```

_See code: [dist/commands/dev/git/open-linear-branch.ts](https://github.com/kinigitbyday/rk/blob/v0.0.0/dist/commands/dev/git/open-linear-branch.ts)_

## `rk dev:git:pr`

Open a pull request using GitHub API

```
USAGE
  $ rk dev:git:pr [-t <value>] [-b <value>] [-T fix|feat|chore] [--base <value>] [--githubToken <value>]

FLAGS
  -T, --type=<option>    [default: fix] Pull request type (e.g., "fix", "feat")
                         <options: fix|feat|chore>
  -b, --body=<value>     Pull request description
  -t, --title=<value>    Pull request title
  --base=<value>         [default: master] Base branch
  --githubToken=<value>

DESCRIPTION
  Open a pull request using GitHub API

EXAMPLES
  $ rk dev:git:pr --title "fix: [SC-1234] - Update dependencies" --body "Description of changes" --base main --head feature-branch
```

_See code: [dist/commands/dev/git/pr.ts](https://github.com/kinigitbyday/rk/blob/v0.0.0/dist/commands/dev/git/pr.ts)_

## `rk dev:git:resume-linear-branch`

Resumes linear branches

```
USAGE
  $ rk dev:git:resume-linear-branch [--token <value>]

FLAGS
  --token=<value>

DESCRIPTION
  Resumes linear branches
```

_See code: [dist/commands/dev/git/resume-linear-branch.ts](https://github.com/kinigitbyday/rk/blob/v0.0.0/dist/commands/dev/git/resume-linear-branch.ts)_

## `rk dev:git:switch-linear-branch`

Switches to a branch by a shortcut name

```
USAGE
  $ rk dev:git:switch-linear-branch --username <value> --teamKey <value> [--token <value>]

FLAGS
  --teamKey=<value>   (required)
  --token=<value>
  --username=<value>  (required) [default: process.env.USER]

DESCRIPTION
  Switches to a branch by a shortcut name
```

_See code: [dist/commands/dev/git/switch-linear-branch.ts](https://github.com/kinigitbyday/rk/blob/v0.0.0/dist/commands/dev/git/switch-linear-branch.ts)_

## `rk help [COMMAND]`

Display help for rk.

```
USAGE
  $ rk help [COMMAND] [-n]

ARGUMENTS
  COMMAND  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for rk.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.1.10/src/commands/help.ts)_
<!-- commandsstop -->
