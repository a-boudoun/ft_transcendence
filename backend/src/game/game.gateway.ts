import { SubscribeMessage, WebSocketGateway, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer } from '@nestjs/websockets';
import { subscribe } from 'diagnostics_channel';
import { Server, Socket } from 'socket.io';
import { gameService } from './game.service';
import { CreatePlayerDto } from './dto/player.dto';

@WebSocketGateway({
	//Cross-Origin-Resource-Sharing (CORS) is a mechanism that uses additional HTTP headers to tell browsers 
	//to give a web application running at one origin,
	//access to selected resources from a different origin.
	cors: {
		origin: '*',
	},
})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private gameService: gameService) {}
@WebSocketServer()
  server: Server;
  private rooms: Map<string, Set<Socket>> = new Map();

  @SubscribeMessage('matchPlayers')
  handleMatchPlayers(socket: Socket, data: any) {
    const { playerId1, playerId2 } = data;
    const room = `${playerId1}_${playerId2}`;

    // Create a new room
    this.rooms.set(room, new Set([socket]));

    // Join the room
    socket.join(room);
  }

  @SubscribeMessage('playerMove')
  handlePlayerMove(socket: Socket, data: any) {
    const { room, movement } = data;

    // Broadcast the movement event to all clients in the room
    socket.to(room).emit('playerMoved', movement);
  }

  // Other event handlers...

  handleDisconnect(client: Socket) {
    // Remove the socket from its associated room
    console.log(`Client disconnected: ${client.id}`);
    for (const [room, sockets] of this.rooms.entries()) {
      if (sockets.has(client)) {
        sockets.delete(client);
        if (sockets.size === 0) {
          // If the room becomes empty, remove it
          this.rooms.delete(room);
        }
        break;
      }
    }
  }

  handleConnection(client: Socket, ...args: any[]) {
    //TODO: add player to matchmaker
    console.log(`Client connected: ${client.id}`);
  }

  @SubscribeMessage('message')
  handleMessage(client: Socket, payload: any): string {
	console.log(payload);
    return 'Hello world!';
  }

  @SubscribeMessage('sayHi')
  	handleSayHi(client: Socket, payload: string): void{
	  this.server.emit('message', 'Hi everyone!');
  	}
}
 