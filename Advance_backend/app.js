import path from "path";


import express from 'express';
import { Server } from 'socket.io';
import fs  from 'fs/promises'

import dotenv from 'dotenv';
import   {createServer}     from 'http'
dotenv.config();
import projectRoute from './routes/ProjectRoute.js';


import cors from 'cors';



const app = express();
const server = createServer(app);
const io = new Server(server , {
    cors:{
        origin:'*',
        methods:['GET','POST']
    }
});


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));




const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {

    res.send("<h1>Welcome to the New era of IDE</h1>")

})

app.use('/api/v1/project', projectRoute)


const editorNamespace = io.of("/editor");

editorNamespace.on("connection", (socket) => {

  const projectId = socket.handshake.query.projectId;

  console.log(`Client connected to project ${projectId}`);




  socket.on("getFileContent", async ({ path: filePath }) => {

    try {

      const projectRoot = path.join(
        process.cwd(),
        "projects",
        projectId
      );

      const fullPath = path.join(projectRoot, filePath);

      console.log("Reading:", fullPath);

      const content = await fs.readFile(fullPath, "utf8");

      socket.emit("fileContent", {
        filepath: filePath,
        data: content
      });

    } catch (error) {

      console.error("Error reading file:", error);

      socket.emit("error", {
        message: "File not found"
      });

    }

  });

});



server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);

})