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

export const getFileContent = async (req, res) => {
    try {
        const filePath = req.query.path;

        if (!filePath) {
            return res.status(400).json({ message: "Path is required" });
        }

        // In a real production app, ensure you sanitize this path to avoid directory traversal attacks!
        // Right now, this reads any absolute path given since react-tree provides absolute paths.
        const content = await fs.readFile(filePath, 'utf-8');
        return res.status(200).json({ content });

    } catch (error) {
        console.error("Error reading file:", error);
        return res.status(500).json({ message: "Could not read file", error: error.message });
    }
}
