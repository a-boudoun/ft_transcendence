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
        console.log('sending position');
        // this.engineService.printBallPosition();
        this.engineService.sendPosition(room);
      }
    }
  }
  
  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.handshake.query.username}`);
    this.gameService.removePlayer(client);
    this.engineService.stopEngine();
  }

  @SubscribeMessage('rightPaddle')
  handlerPaddle(client: Socket, data: any) {
    this.engineService.setRightBoardPosition(data.y);
  }
  
  @SubscribeMessage('leftPaddle')
  handlelPaddle(client: Socket, data: any) {
    this.engineService.setLeftBoardPosition(data.y);
  }

  // @Interval(1000 / 60)
  // handleInterval() {
  //   console.log('interval');
  // }

  // @Timeout(15)
  // handleTimeout() {
  //   console.log('timeout');
  // }
}
