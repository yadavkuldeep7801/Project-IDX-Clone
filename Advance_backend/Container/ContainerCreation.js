import Docker from "dockerode";
const docker = new Docker();

export const handleContainerCreate = async (
  projectId,
  wsShell,
  req,
  socket,
  head
) => {
  console.log("Project id:", projectId);

  let container;

  try {
   
    container = await docker.createContainer({
      Image: "node:22",
      Tty: true,
      Cmd: ["/bin/bash"],
      AttachStdin: true,
      AttachStdout: true,
      AttachStderr: true,
      
      WorkingDir: "/home/sandbox/app",
      Volumes: {
        "/home/sandbox/app": {}
      },
      
      HostConfig: {
        Binds: [
          `${process.cwd()}/projects/${projectId}:/home/sandbox/app`,
        ],
        PortBindings: {
          "5173/tcp": [{ HostPort: "0" }],
        },
      },
      
      ExposedPorts: {
        "5173/tcp": {},
      },
      
      Env: ["HOST=0.0.0.0"],
      
      Cmd: ["cd", "sandbox", "&&", "npm", "run", "dev", "--", "--host", "0.0.0.0"],
      
      Labels: {
        projectId: projectId,
      },
    });

    console.log("Container created:", container.id);

    await container.start();
    console.log("Container started");

    
    const inspectData = await container.inspect();
    const ports = inspectData.NetworkSettings.Ports;
    console.log("Ports:", ports);

    wsShell.handleUpgrade(req, socket, head, (ws) => {
      
      ws.container = container;
      ws.ports = ports
      wsShell.emit("connection", ws, req);
    });

  } catch (error) {
    console.error("Error creating container:", error);

    
    if (container) {
      try {
        await container.remove({ force: true });
      } catch (e) {
        console.error("Cleanup error:", e);
      }
    }

    socket.destroy(); 
  }
};