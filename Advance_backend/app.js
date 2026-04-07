import path from "path";
import chokidar from "chokidar";
import express, { json } from "express";
import { Server } from "socket.io";
import fs from "fs/promises";
import dotenv from "dotenv";
import { createServer } from "http";
import projectRoute from "./routes/ProjectRoute.js";
import cors from "cors";
import { WebSocketServer } from "ws";
import querystring from "querystring";
import { handleShellCreation } from "./Container/handleShellCreation.js";


import {handleContainerCreate} from "./Container/ContainerCreation.js";

dotenv.config();

const app = express();
const server = createServer(app);

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
}));

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("<h1>Welcome to the New era of IDE</h1>");
});

app.use("/api/v1/project", projectRoute);


const editorNamespace = io.of("/editor");

editorNamespace.on("connection", (socket) => {
  const projectId = socket.handshake.query.projectId;

  if (!projectId) {
    console.log("No projectId provided");
    return;
  }

  
  socket.join(projectId);

 
  

  
  socket.on("getFileContent", async ({ path: filePath }) => {
    try {
      const projectRoot = path.join(process.cwd(), "projects", projectId);
      const fullPath = path.join(projectRoot, filePath);

      const content = await fs.readFile(fullPath, "utf8");

      socket.emit("fileContent", {
        filepath: filePath,
        data: content.toString()
      });

    } catch (error) {
      socket.emit("error", {
        message: "File not found"
      });
    }
  });
  socket.on("fileUpdate", async ({ path: filePath, content }) => {
  try {
    console.log(filePath);
    
   ;

    console.log(" Writing file:", filePath);

    await fs.writeFile(filePath, content, "utf8");


    editorNamespace.to(projectId).emit("fileChanged", {
      event: "change",
      path: filePath,
    });

  } catch (error) {
    console.error("❌ Write error:", error);
    socket.emit("error", { message: "File write failed" });
  }
});

  socket.on("disconnect", () => {
    console.log(`Client disconnected from project ${projectId}`);
  });
});


chokidar
  .watch(path.join(process.cwd(), "projects"), {
    ignoreInitial: true
  })
  .on("all", (event, filePath) => {
    console.log(event, filePath);

    const parts = filePath.split(path.sep);
    const projectIndex = parts.indexOf("projects");

    if (projectIndex !== -1 && parts.length > projectIndex + 1) {
      const projectId = parts[projectIndex + 1];

      
      editorNamespace.to(projectId).emit("fileChanged", {
        event,
        path: filePath
      });
    }
  });

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});



const wsForShell = new WebSocketServer({
    noServer: true,
  });


  server.on("upgrade", (req, socket, head) => {
  const isShell = req.url?.includes("/terminal");

  if (!isShell) {
    socket.destroy(); 
    return;
  }

  console.log("Upgrade URL:", req.url);

  const query = req.url.split("?")[1] || "";
  const { projectId } = querystring.parse(query);

  if (!projectId) {
    socket.destroy();
    return;
  }

  handleContainerCreate(projectId, wsForShell, req, socket, head);
});

 wsForShell.on("connection", (ws, req) => {
  const container = ws.container; 

  const ports = ws.ports['5173/tcp'][0].HostPort;

  if(ports){

    ws.send(JSON.stringify({ type: "port", port: ports }))

  }
  

  if (!container) {
    ws.close();
    return;
  }

  handleShellCreation(container, ws);

  ws.on("close", async () => {
    try {
      await container.remove({ force: true });
      console.log(`Container ${container.id} removed`);
    } catch (err) {
      console.error(err);
    }
  });

  ws.on("error", (err) => {
    console.error("WebSocket error:", err);
  });
});