import { execSync } from 'child_process';

export const execPromise = (...cmd: string[]) => {
  return new Promise((resolve, reject) => {
    try {
      const result = execSync(cmd.toString());
      resolve(result.toString());
    } catch (error) {
      reject(error);
    }
  });
};
