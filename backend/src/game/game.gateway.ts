import { SubscribeMessage, WebSocketGateway, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { gameService } from './game.service';
import { engineService } from './engine.service';
import { Player } from './interfaces/player.interface';
import { Room } from './interfaces/room.interface';
import { subscribe } from 'diagnostics_channel';
import { Interval, Timeout } from '@nestjs/schedule';

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
    // TODO: check if the player is already in a room 
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
      this.engineService.createGameSimulation(this.recentRomm);
      const room: Room = this.gameService.findRoom(this.recentRomm);
      if (room) {
        console.log('sending position');
        this.engineService.sendPosition(room);
      }
    }
  }
  
  handleDisconnect(client: Socket) {
    let removedRoom: string | null ;
    console.log(`Client disconnected: ${client.handshake.query.username}`);
    removedRoom = this.gameService.removePlayer(client);
    if (removedRoom) {
      this.engineService.removeGameSimulation(removedRoom);
    }
  }

  @SubscribeMessage('rightPaddle')
  handlerPaddle(client: Socket, data: any) {
    this.engineService.setRightBoardPosition(data.room, data.y);
  }
  
  @SubscribeMessage('leftPaddle')
  handlelPaddle(client: Socket, data: any) {
    this.engineService.setLeftBoardPosition(data.room, data.y);
  }

}
