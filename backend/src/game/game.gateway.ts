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

  @SubscribeMessage('full-Game')
  handleFullGame(client: Socket, data: any) {
    client.data.username = data;
    const room: Room = this.gameService.findRoomByPlayer(data);
    if (room !== undefined) {
      const data: any = {
        room: room.id,
        leftPlayer: room.players[0].position === 'left' ? room.players[0].username : room.players[1].username,
        rightPlayer: room.players[0].position === 'right' ? room.players[0].username : room.players[1].username,
      }
      client.emit('game-info', data);
    }
  }

  @SubscribeMessage('leave-game')
  handleLeaveGame(client: Socket, data: any) {
    let removedRoom : boolean;
    removedRoom = this.gameService.removePlayerFromRoom(data.player, data.room);
    if (removedRoom === true)
      this.engineService.removeGameSimulation(data.room);
    this.gameService.emitToplayer(data.player, 'leave-game');
  }

  @SubscribeMessage('cancel-looking')
  handleCancelLooking(client: Socket, user: string) {
    if (!client.data.username) {
      client.data.username = user;
    }
    this.gameService.removePlayerFromQueue(client);
  }
  
  @SubscribeMessage('looking-for-match')
  handleLookingForMatch(client: Socket, user: string) {
    client.data.username = user;
    let found: Room | null;
    this.gameService.addPlayerToQueue(client);
    found = this.gameService.findMatch();
    if (found !== null) {
      this.engineService.createGameSimulation(found.id);
      this.engineService.sendPosition(found);
      this.engineService.addServerToGame(found.id, this.server);
    }
  }

  @SubscribeMessage('player-status')
  handleAlreadyLooking(client: Socket, data: any) {
    let roomId: string | null;

    client.data.username = data;
    if (this.gameService.isInQueue(client)){
      this.gameService.emitToplayer(data, 'player-status', 'already-looking');
    }
    else if (roomId = this.gameService.isInGame(data)){
      client.join(roomId);
      this.gameService.emitToplayer(data, 'player-status', 'already-playing');
    }
    else 
      client.emit('player-status', 'not-looking');
  }
}
