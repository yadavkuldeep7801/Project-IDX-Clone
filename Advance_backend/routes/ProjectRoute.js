
import express from 'express'
import { ProjectCreactionController } from '../Controller/ProjectCreactionController.js';

const router = express.Router();

router.post('/create-react-project', ProjectCreactionController)


export default router;