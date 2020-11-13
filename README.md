# Hello world javascript action

This action prints "Hello World" or "Hello" + the name of a person to greet to the log.

## Inputs

### `who-to-greet`

**Required** The name of the person to greet. Default `"World"`.

## Outputs

### `time`

The time we greeted you.

## Deploy
npm version minor
git push --follow-tags

## Example usage

uses: lucarducci/zc-deploy-action-github@v1
with:
  who-to-greet: 'Luca'