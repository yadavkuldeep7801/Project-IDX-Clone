export const handleShellCreation = (container, ws) => {
  container.exec(
    {
      Cmd: ["/bin/bash"],
      AttachStdin:true,
      AttachStdout: true,
      AttachStderr: true,
      Tty: true, 
    },
    (err, exec) => {
      if (err) {
        console.error(err);
        return;
      }

      exec.start(
        {
          hijack: true,
          stdin: true, 
        },
        (err, stream) => {
          if (err) {
            console.error(err);
            return;
          }

          stream.on("data", (chunk) => {
            ws.send(chunk.toString());
          });

          ws.on("message", (message) => {
            stream.write(message);
          });

          ws.on("close", () => {
            stream.end();
          });
        }
      );
    }
  );
};