export type LogLevel = 'info' | 'warn' | 'error' | 'debug';

// ANSI color codes
const COLORS: Record<LogLevel, string> = {
  info:  '\x1b[36m',  // cyan
  warn:  '\x1b[33m',  // yellow
  error: '\x1b[31m',  // red
  debug: '\x1b[35m',  // magenta
};
const RESET = '\x1b[0m';
const DIM   = '\x1b[2m';
const BOLD  = '\x1b[1m';

class Logger {
  private formatTimestamp(): string {
    return new Date().toISOString();
  }

  private formatContext(context: string): string {
    return `${BOLD}[${context}]${RESET}`;
  }

  private log(level: LogLevel, context: string, message: string, meta?: unknown): void {
    const color     = COLORS[level];
    const timestamp = `${DIM}${this.formatTimestamp()}${RESET}`;
    const lvlLabel  = `${color}${BOLD}${level.toUpperCase().padEnd(5)}${RESET}`;
    const ctx       = this.formatContext(context);

    const metaStr = meta !== undefined
      ? `\n         ${DIM}${JSON.stringify(meta, null, 2)}${RESET}`
      : '';

    console.log(`${timestamp} ${lvlLabel} ${ctx} ${message}${metaStr}`);
  }

  info(context: string, message: string, meta?: unknown): void {
    this.log('info', context, message, meta);
  }

  warn(context: string, message: string, meta?: unknown): void {
    this.log('warn', context, message, meta);
  }

  error(context: string, message: string, meta?: unknown): void {
    this.log('error', context, message, meta);
  }

  debug(context: string, message: string, meta?: unknown): void {
    if (process.env.NODE_ENV !== 'production') {
      this.log('debug', context, message, meta);
    }
  }
}

// Singleton exported for use across the app
export const logger = new Logger();
