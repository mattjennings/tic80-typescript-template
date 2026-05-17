# TIC-80 Typescript Template

Template for getting started with TIC-80 using Typescript and Rolldown.

Starting files and Typescript types taken from [tic80-typescript](https://github.com/scambier/tic80-typescript).

## Getting Started

This project uses pnpm via corepack:

### Install pnpm

```
# install corepack if using Node 25 or later
npm install --global corepack@latest

# Enable pnpm
corepack enable

# Install packages
pnpm install
```

### Set tic80 binary

Open `package.json` and modify the `tic80` script to be the location of your tic80 binary

### Start

```
pnpm start
```

## How does it work?

Tic80 is started in the root directory with `cart.js` - this allows you to use the editor to modify sprites etc. It then loads `build/output.js` which is the compiled js from rolldown of your typescript source.

## Exporting

The following scripts will export for the respective platform into `exports/`

```
pnpm run export:html
pnpm run export:mac
pnpm run export:linux
pnpm run export:win
```
