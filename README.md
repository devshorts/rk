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
* [`rk dev:git:pr`](#rk-devgitpr)
* [`rk dev:git:resume-shortcut-branch`](#rk-devgitresume-shortcut-branch)
* [`rk dev:git:switch-shortcut-branch`](#rk-devgitswitch-shortcut-branch)
* [`rk help [COMMAND]`](#rk-help-command)
* [`rk random:rainbowify`](#rk-randomrainbowify)

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

## `rk dev:git:pr`

Open a pull request using GitHub API

```
USAGE
  $ rk dev:git:pr -t <value> --head <value> [-b <value>] [-T fix|feat|chore] [--base <value>]

FLAGS
  -T, --type=<option>  [default: fix] Pull request type (e.g., "fix", "feat")
                       <options: fix|feat|chore>
  -b, --body=<value>   Pull request description
  -t, --title=<value>  (required) Pull request title
  --base=<value>       [default: master] Base branch
  --head=<value>       (required) [default: HEAD] Head branch

DESCRIPTION
  Open a pull request using GitHub API

EXAMPLES
  $ rk dev:git:pr --title "fix: [SC-1234] - Update dependencies" --body "Description of changes" --base main --head feature-branch
```

_See code: [dist/commands/dev/git/pr.ts](https://github.com/kinigitbyday/rk/blob/v0.0.0/dist/commands/dev/git/pr.ts)_

## `rk dev:git:resume-shortcut-branch`

Resumes shortcut branches

```
USAGE
  $ rk dev:git:resume-shortcut-branch [--token <value>] [--readyForDevState <value>]

FLAGS
  --readyForDevState=<value>  [default: Ready For Development]
  --token=<value>             [default: b9d37892-dd59-4f88-b545-1dafdf807ee5]

DESCRIPTION
  Resumes shortcut branches
```

_See code: [dist/commands/dev/git/resume-shortcut-branch.ts](https://github.com/kinigitbyday/rk/blob/v0.0.0/dist/commands/dev/git/resume-shortcut-branch.ts)_

## `rk dev:git:switch-shortcut-branch`

Switches to a branch by a shortcut name

```
USAGE
  $ rk dev:git:switch-shortcut-branch [--token <value>] [--readyForDevState <value>]

FLAGS
  --readyForDevState=<value>  [default: Ready For Development]
  --token=<value>             [default: b9d37892-dd59-4f88-b545-1dafdf807ee5]

DESCRIPTION
  Switches to a branch by a shortcut name
```

_See code: [dist/commands/dev/git/switch-shortcut-branch.ts](https://github.com/kinigitbyday/rk/blob/v0.0.0/dist/commands/dev/git/switch-shortcut-branch.ts)_

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

## `rk random:rainbowify`

Creates a rainbowified/party-fied gif from an image for slack

```
USAGE
  $ rk random:rainbowify [--gif <value> | --colors <value>] [--useGifIntermediateFrames | --image <value>] [--outDir
    <value>] [--delay <value>] [--saturation <value>] [--lighten <value>] [--size <value>]

FLAGS
  --colors=<value>                 [default: 10] Number of colors to use
  --delay=<value>                  [default: 3] Frame delay for the gif
  --gif=<value>                    Gif to use
  --image=<value>                  Image to use
  --lighten=<value>                [default: 10] Lightening level to apply to each frame
  --outDir=<value>                 [default: .] Output file dir
  --saturation=<value>             [default: 50] Saturation level to apply to each frame
  --size=<value>                   [default: 128] Squared size of the output image (scaled to fit)
  --[no-]useGifIntermediateFrames  Whether or not to add intermediate frames to gifs to keep the fast rainbow effect.
                                   Can increase the size of the gif.

DESCRIPTION
  Creates a rainbowified/party-fied gif from an image for slack
```

_See code: [dist/commands/random/rainbowify.ts](https://github.com/kinigitbyday/rk/blob/v0.0.0/dist/commands/random/rainbowify.ts)_
<!-- commandsstop -->
