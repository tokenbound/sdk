import { exec } from 'child_process' // Node.js child_process module

/**
 * Executes a shell command and returns the output as a promise.
 * 
 * @param cmd - The shell command to be executed.
 * @returns A promise that resolves with the command output (stdout or stderr).
 * @throws Will reject the promise with an error if the command execution fails.
 * 
 * @example
 * ```typescript
 * shellCommand('ls -l').then(console.log);
 * ```
 */
export function shellCommand(cmd: string): Promise<string> {
  return new Promise((resolve, reject) => {
      exec(cmd, (error, stdout, stderr) => {
          if (error) {
              console.warn(`Error executing command: ${cmd}`);
              reject(error);
              return;
          }
          resolve(stdout || stderr);
      });
  });
}