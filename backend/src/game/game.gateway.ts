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
    // console.log(`Client connected: ${client.id}`);
    this.gameService.addPlayerToQueue(client);
    // this.gameService.printQueue();
    this.gameService.matchPlayers();
    this.gameService.informPlayers('room');
    // this.gameService.printRooms();
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

}
// ! run the engin in ht ebackend and export the locations to the frontend
 