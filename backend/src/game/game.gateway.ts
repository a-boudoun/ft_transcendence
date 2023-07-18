import { SubscribeMessage, WebSocketGateway, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { gameService } from './game.service';
import { Player } from './interfaces/player.interface';
import { Room } from './interfaces/room.interface';
@WebSocketGateway({
	//Cross-Origin-Resource-Sharing (CORS) is a mechanism that uses additional HTTP headers to tell browsers 
	//to give a web application running at one origin,
	//access to selected resources from a different origin.
	cors: {
		origin: '*',
	},
})
//TODO: check if the player is authenticated
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private gameService: gameService) {}
@WebSocketServer()
  server: Server;

  handleConnection(client: Socket, data: any) {
    if (!client.handshake.query.username ||  client.handshake.headers.connection === 'close') {
      client.disconnect(true);
      return;
    }
    // console.log(`Client connected: ${client.id}`);
    console.log(
      'client connected', client.handshake.query.username,
    );
    this.gameService.addPlayerToQueue(client);
    // this.gameService.printQueue();
    this.gameService.matchPlayers();
    //   'with headers', client.handshake.headers,
    //   );
    // console.log('headers', client.handshake.headers)
    // this.gameService.printRooms();
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.handshake.query.username}`);
    this.gameService.removePlayerFromQueue(client);
  }

  @SubscribeMessage('move')
  handleMove(client: Socket, data: any) {
    const room: Room = this.gameService.findRoom(data.roomID);
    if (room) {
      room.players.forEach((player) => {
        if (player.socket.id !== client.id) {
          player.socket.emit('move', data);
        }
      });
    }
  }
}

// ! run the engin in ht ebackend and export the locations to the frontend
 