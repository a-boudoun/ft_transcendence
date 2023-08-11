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

  EmitToRoom(room: Room, event: string, data: any) {
    this.server.to(room.id).emit(event, data);
  }

  @SubscribeMessage('rightPaddle')
  handlerPaddle(client: Socket, data: any) {
    this.engineService.setRightBoardPosition(data.room, data.y);
  }
  
  @SubscribeMessage('leftPaddle')
  handlelPaddle(client: Socket, data: any) {
    this.engineService.setLeftBoardPosition(data.room, data.y);
  }

  @SubscribeMessage('full-Game')
  handleFullGame(client: Socket, data: any) {
    client.data.username = data;
    console.log('full game', data);
    //TODO: emit the place of the players
    // TODO: emit only the room details to the client
    // TODO: add the socket id to the player room
    // const room: Room = this.gameService.findRoomByPlayer(data);
    // if (room) {
    //   this.engineService.createGameSimulation(room.id);
    //   this.engineService.sendPosition(room);
    // }
  }
  
  //TODO: remove player from matchmaking queue
  @SubscribeMessage('cancel-looking')
  handleCancelLooking(client: Socket, user: string) {
    if (!client.data.username) {
      client.data.username = user;
    }
    this.gameService.removePlayerFromQueue(client);
  }
  
  //TODO: add player to matchmaking queue
  //TODO: add username to client.data
  @SubscribeMessage('looking-for-match')
  handleLookingForMatch(client: Socket, user: string) {
    client.data.username = user;
    let found: Room | null;
    this.gameService.addPlayerToQueue(client);
    found = this.gameService.findMatch();
    if (found !== null) {
      this.engineService.createGameSimulation(found.id);
      this.engineService.sendPosition(found);
    }
  }

  //TODO: check if the player is already in a matchmaking queue
  @SubscribeMessage('player-status')
  handleAlreadyLooking(client: Socket, data: any) {
    let roomId: string | null;

    client.data.username = data;
    if (this.gameService.isInQueue(client)){
      client.emit('player-status', 'already-looking');
    }
    else if (roomId = this.gameService.isInGame(data)){
      client.join(roomId);
      client.emit('player-status', 'already-playing');
    }
    else 
      client.emit('player-status', 'not-looking');
  }
}
