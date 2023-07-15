import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';


@WebSocketGateway()
export class MyGateway {
  @WebSocketServer()
  server: Server;

  handleConnection(socket: Socket): void {
    console.log(this.server.sockets.adapter.sids)
    console.log(typeof( this.server.sockets.adapter.sids))
    const username = socket.handshake.auth.username;
    console.log(`user ${username} connected`);
    if(!username) { return; }

    socket.on("private message", ({ content, to, from }) => {
      // 
      // ADD TO DATABASE
      socket.to(to).emit("private message", {
        content,
        from: from,
      });
    });

    this.server.on('connection', (socket) => {
      const users = [];
        for (let [id, socket] of this.server.of("/").sockets) {
          users.push({
            userID: id,
            username: socket.handshake.auth.username,
          });
        }

        socket.emit("users", users);
       
        socket.broadcast.emit("user connected", users);
        console.log('connected')

      });
  }
  handleDisconnect(socket: Socket): void {
    const username = socket.handshake.auth.username;
    console.log(`user ${username} disconnected`);
  }

}
