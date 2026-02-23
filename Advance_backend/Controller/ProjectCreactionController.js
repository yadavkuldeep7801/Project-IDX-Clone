
import { createProjectofReact } from '../service/ProjectCreation.js';
import tree from 'directory-tree';
import path from 'path';
import uuidv4  from 'uuid4';

export const ProjectCreactionController = async (req, res) => {

   
    try{
         const { projectType } = req.body;
          
        if (projectType === 'react') {
        const projectId = uuidv4();
        console.log("Project ID:", projectId);
           const result = await createProjectofReact(projectId);
          const path_directory = path.resolve(`./projects/${projectId}`);
           const projectTree = tree(path_directory);
        return res.status(200).json({message: "Project created successfully", projectId, result, projectTree});
    }
    else{
        return res.status(400).json({message: "Invalid project type"});
    }

    }
    catch(err){
        return res.status(500).json({message: "Something went wrong", error: err.message});

    }

  

}
