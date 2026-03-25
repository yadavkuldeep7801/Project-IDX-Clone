

import fs from "fs/promises";


export const EditoSocketHandler = (socket, path, projectId) =>{

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

      socket.on("editFile", async ({ path: filePath, content }) => {
        try {
          const projectRoot = path.join(
            process.cwd(),
            "projects",
            projectId
          );
          const fullPath = path.join(projectRoot, filePath);
          await fs.writeFile(fullPath, content, "utf8");
          socket.emit("fileSaved", { filepath: filePath });
        } catch (error) {
          console.error("Error saving file:", error);
          socket.emit("error", { message: "Failed to save file" });
        }
      });

      socket.on("createFile", async ({ path: filePath , data}) => {
        try{

            // if the file exit 



        }
        catch(error){

            Socket.emit('createfilError' , { message: "Failed to create file" })

        }
      })

      socket.on("deleteFile", async ({ path: filePath }) => {

        try{
                 

        }
        catch(error){

        }

      })
}