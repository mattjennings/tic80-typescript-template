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

Open `package.json` and modify the `tic80` script to execute the location of your tic80 binary

### Start

```
pnpm start
```

## How does it work?

Rolldown outputs `build/cart.js` which is a fully working cart that can be loaded by TIC-80.

During `pnpm start`, if TIC-80 saves the cart, it extracts the inline asset comments to `src/assets.js`. The comments from this file
are included in the `build/cart.js`.

## Exporting

The following scripts will export for the respective platform into `exports/`

```
pnpm run export:html
pnpm run export:mac
pnpm run export:linux
pnpm run export:win
```
