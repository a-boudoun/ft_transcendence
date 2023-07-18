import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';


@WebSocketGateway()
export class MyGateway {

  
  @WebSocketServer()
  server: Server;

  handleConnection(socket: Socket): void {
    // const gusers = [];

    const username = socket.handshake.auth.username;

  
    // for (let [id, socket] of this.server.of("/").sockets) {
    //   gusers.push({
    //     userID: id,
    //     username: socket.handshake.auth.username,
    //   });
    // }
    // console.log('-------------------------------')
    // console.log(gusers)
    // console.log('-------------------------------')

    console.log(`user ${username} connected`);
    if(!username) { return; }

    socket.on("private message", ({ content, to, from }) => {
      // 
      // ADD TO DATABASE
      socket.to(to).emit("private message", {
        content,
        from: from,
      });
      console.log({ content, to, from })
    });

    this.server.on('connection', (socket) => {
      const users = [];
        for (let [id, socket] of this.server.of("/").sockets) {
          users.push({
            userID: id,
            username: socket.handshake.auth.username,
          });
        }

        this.server.emit("users", users);
       console.log(users);
        // socket.broadcast.emit("user connected", users);
        console.log('connected')

      });
  }
  handleDisconnect(socket: Socket): void {
    const username = socket.handshake.auth.username;
    
   
  }

}
