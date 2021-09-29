/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import chalk from 'chalk';

function makeLoggerSeverity(loggerFunc: any, color: Function) {
  return (log: any) => loggerFunc(color(log));
}

function logSuccess(msg: string, details?: any) {
  const logMsg = `✅ Success: ${msg}`;

  if (!details) return console.log(logMsg);
  console.log(`${logMsg}\n\t`, details);
}

function logError(msg: string, details: any) {
  console.error(`❌ ${msg}\n\t`, details);
}

export const logger = {
  info: makeLoggerSeverity(console.log, chalk.blue.bold),
  error: logError,
  success: logSuccess,
};
