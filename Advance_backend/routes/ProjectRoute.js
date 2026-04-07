import tree from 'directory-tree';
import express from 'express'
import path from 'path';
import { ProjectCreactionController ,getFileContent} from '../Controller/ProjectCreactionController.js';

const router = express.Router();

router.post('/create-react-project', ProjectCreactionController)
router.get('/project/file-content', getFileContent)
router.get('/project', async (req, res) => {
    try {
        const { projectId } = req.query;


        if (!projectId) {
            return res.status(400).json({ message: "Missing projectId" });
        }
        console.log("Project Tree:", projectId);

            const path_directory = path.resolve(`./projects/${projectId}`);
            const projectTree = tree(path_directory);

            return res.status(200).json({ projectTree });

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

export default router;