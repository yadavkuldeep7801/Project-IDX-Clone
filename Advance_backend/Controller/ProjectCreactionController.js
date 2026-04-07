import { createProjectofReact, createProjectofnextjs } from '../service/ProjectCreation.js';
import tree from 'directory-tree';
import path from 'path';
import uuidv4 from 'uuid4';

export const ProjectCreactionController = async (req, res) => {
    try {
        const projectType = req.body?.projectType;

        if (projectType !== 'react' && projectType !== 'nextjs') {
            return res.status(400).json({ message: "Invalid project type" });
        }

        const projectId = uuidv4();
        console.log("Project ID:", projectId);

        let result;
        if (projectType === 'react') {
            result = await createProjectofReact(projectId);
        } else if (projectType === 'nextjs') {
            result = await createProjectofnextjs(projectId);
        }

        const path_directory = path.resolve(`./projects/${projectId}`);
        const projectTree = tree(path_directory);

        return res.status(200).json({
            message: "Project created successfully",
            projectId,
            result,
            projectTree
        });

    } catch (err) {
        return res.status(500).json({ message: "Something went wrong", error: err.message });
    }
}

import fs from 'fs/promises';
import { log } from 'console';

export const getFileContent = async (req, res) => {
    try{
        const { filePath } = req.query;
        console.log("Requested file path:", filePath);
        if (!filePath) {
            return res.status(400).json({ message: "Missing filePath" });
        }
       
        const fileContent = await fs.readFile(filePath, 'utf-8');
        return res.status(200).json({ content: fileContent.toString() });

    }
    catch(err){
        return res.status(500).json({ message: "Something went wrong", error: err.message });
    }
}
