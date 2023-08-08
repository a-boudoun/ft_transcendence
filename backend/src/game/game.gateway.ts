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
	//access to selected resources from a different origin
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
    console.log('new connection');
  }
  
  handleDisconnect(client: Socket) {
  }

  @SubscribeMessage('rightPaddle')
  handlerPaddle(client: Socket, data: any) {
    this.engineService.setRightBoardPosition(data.room, data.y);
  }
  
  @SubscribeMessage('leftPaddle')
  handlelPaddle(client: Socket, data: any) {
    this.engineService.setLeftBoardPosition(data.room, data.y);
  }

  @SubscribeMessage('refresh')
  handleRefresh(client: Socket, data: any) {
    console.log('refreshing');
  }
  
  @SubscribeMessage('endGame')
  handleEndGame(client: Socket, data: any) {
    const room: Room = this.gameService.findRoom(data.room);
    if (room) {
      console.log('ending game');
      this.engineService.removeGameSimulation(room.id);
      this.gameService.removeRoom(room.id);
    }
  }

  @SubscribeMessage('startGame')
  handleStartGame(client: Socket, data: any) {
    client.handshake.query.username = data.username;
    console.log(
      `client id ${client.handshake.query.username}`
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
  
  //TODO: remove player from matchmaking queue
  @SubscribeMessage('cancel-looking')
  handleCancelLooking(client: Socket, user: string) {
    console.log('cancel looking', user);
    this.gameService.removePlayerFromQueue(user);
  }
  
  //TODO: add player to matchmaking queue
  //TODO: add username to client.data
  @SubscribeMessage('looking-for-match')
  handleLookingForMatch(client: Socket, user: string) {
    console.log('looking-for-match', user);
    let found: boolean = false;
    client.data.username = user;
    this.gameService.addPlayerToQueue(client);
    found = this.gameService.findMatch();
    if (found){
    }

  }

  //TODO: check if the player is already in a matchmaking queue
  @SubscribeMessage('already-looking')
  handleAlreadyLooking(client: Socket, data: any) {
    console.log('already-looking', data);
    if (!client.data.username) {
      client.data.username = data;
    }
    if (this.gameService.isInQueue(data)){
      this.gameService.removePlayerFromQueue(data);
      this.gameService.addPlayerToQueue(client);
      client.emit('already-looking');
    }
  }
}
