import { promisify } from 'node:util';
import child_process from 'node:child_process';
const exec = promisify(child_process.exec);
import uuid4 from 'uuid4'

import fs from 'node:fs/promises';

import dotenv from 'dotenv';
dotenv.config();




export const createProjectofReact = async (projectId ) => {

    await fs.mkdir(`./projects/${projectId}`, { recursive: true });

    const result = await exec(`${process.env.REACT_APP_template}` ,{
    cwd: `./projects/${projectId}`,
    
  })

  return result
  
}

