import { promisify } from 'node:util';
import child_process from 'node:child_process';
const exec = promisify(child_process.exec);

import fs from 'node:fs/promises';

import dotenv from 'dotenv';
dotenv.config();

export const createProjectofReact = async (projectId) => {
  await fs.mkdir(`./projects/${projectId}`, { recursive: true });

  // Note: ensure process.env.REACT_APP_template runs non-interactively!
  const result = await exec(`${process.env.REACT_APP_template}`, {
    cwd: `./projects/${projectId}`,
  });

  return result;
}

export const createProjectofnextjs = async (projectId) => {
  await fs.mkdir(`./projects/${projectId}`, { recursive: true });

  // Replaced 'sandbox1' with '.' so it creates in the current directory
  // Added '--yes' to bypass the npx installation prompt
  const cmd = `npx --yes create-next-app@latest . --ts --eslint --tailwind --app --src-dir --import-alias "@/*" --use-npm`;

  const result = await exec(cmd, {
    cwd: `./projects/${projectId}`,
  });

  return result;
}
