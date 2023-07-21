import { SubscribeMessage, WebSocketGateway, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { gameService } from './game.service';
import { engineService } from './engine.service';
import { Player } from './interfaces/player.interface';
import { Room } from './interfaces/room.interface';
import { subscribe } from 'diagnostics_channel';
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
  constructor(
    private gameService: gameService,
    private engineService: engineService,
  ) {}
@WebSocketServer()
  server: Server;
  
  recentRomm: string | null;
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
    this.recentRomm = this.gameService.matchPlayers();
    if (this.recentRomm){
      this.engineService.runEngine();
        const room: Room = this.gameService.findRoom(this.recentRomm);
        if (room) {
        this.engineService.sendBallPosition(room);
        this.engineService.printBallPosition();
      }
    }
    //   'with headers', client.handshake.headers,
    //   );
    // console.log('headers', client.handshake.headers)
    // this.gameService.printRooms();
    // this.engineService.printBallPosition();
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.handshake.query.username}`);
    this.gameService.removePlayerFromQueue(client);
  }

  @SubscribeMessage('ball')
  handleMove(client: Socket, data: any) {
    const room: Room = this.gameService.findRoom(data.room);
    if (room) {
      room.players.forEach((player) => {
        if (player.socket.id !== client.id) {
          player.socket.emit('ball', {x: data.x, y: data.y});
        }
      });
    }
  }

  @SubscribeMessage('rightPaddle')
  handlerPaddle(client: Socket, data: any) {
    const room: Room = this.gameService.findRoom(data.room);
    if (room) {
      room.players.forEach((player) => {
        if (player.socket.id !== client.id) {
          player.socket.emit('rightPaddle', {y: data.y});
        }
      });
    }
  }

  @SubscribeMessage('leftPaddle')
  handlelPaddle(client: Socket, data: any) {
    const room: Room = this.gameService.findRoom(data.room);
    if (room) {
      room.players.forEach((player) => {
        if (player.socket.id !== client.id) {
          player.socket.emit('leftPaddle', {y: data.y});
        }
      });
    }
  }
}

// ! run the engin in ht ebackend and export the locations to the frontend