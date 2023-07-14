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

  handleConnection(client: Socket, data: any) {
    // console.log(`Client connected: ${client.id}`);
    this.gameService.addPlayerToQueue(client);
    // this.gameService.printQueue();
    console.log(`rooms ${this.gameService.matchPlayers()}`);
    // this.gameService.printRooms();
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

}
 