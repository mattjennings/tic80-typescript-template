// Polyfills console.log, debug, info, warn, and error
function stringify(args: any[]) {
  return args.map((m) => JSON.stringify(m, null, 1));
}

const console = {
  log(...args: any[]) {
    return trace(stringify(args));
  },
  debug(...args: any[]) {
    return trace(stringify(args), 14);
  },
  info(...args: any[]) {
    return trace(stringify(args), 13);
  },
  warn(...args: any[]) {
    return trace(stringify(args), 4);
  },
  error(...args: any[]) {
    return trace(stringify(args), 2);
  },
};

type Console = typeof console;

declare global {
  var console: Console;
}

globalThis.console = console;
export {};
