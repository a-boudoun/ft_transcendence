import { SubscribeMessage, WebSocketGateway, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { gameService } from './game.service';
import { engineService } from './engine.service';
import { Room } from './interfaces/room.interface';
import { AuthService } from 'src/auth/auth.service';
import {UseGuards} from '@nestjs/common'

@WebSocketGateway()
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private gameService: gameService,
    private engineService: engineService,
  ) {}
@WebSocketServer()
  server: Server;
  
  recentRomm: string | null;

  handleConnection(client: Socket) {
  }
  
  handleDisconnect(client: Socket) {
  }
  
 async endGameSimulation(roomId: string) {
    this.gameService.removeRoom(roomId);
    await this.engineService.removeGameSimulation(roomId);
  }

  @SubscribeMessage('invite-freind')
  handleInviteFreind(client: Socket, data: any) {
    if (client.data.username === data.reciever || this.gameService.isInGame(data.reciever) !== null)
      return;
    this.server.to(data.reciever.toString()).emit('game-invitation', {sender: client.data.username, senderSocketId: client.id, map: data.map});
  }

  @SubscribeMessage('accept-invitation')
  async handleAcceptInvite(client: Socket, data: any) {
    // if invite is already accepted
    // send the player to the game direct without creating a new room
    if (this.gameService.isInGame(client.data.username) !== null){
      client.emit('play-a-friend');
      return;
    }
    if (this.gameService.isInGame(data.senderUsername) !== null){
      return;
    }
    const freindSocket: Socket = this.server.sockets.sockets.get(data.senderSocketId);
    const player1: string = client.data.username;
    const player2: string = data.senderUsername;
    const socket1: Array<Socket> = Array<Socket>(client);
    const socket2: Array<Socket> = Array<Socket>(freindSocket);
    const room: Room = this.gameService.creatRoom(socket1, socket2, player1, player2);
    
    if (room) {
      this.gameService.removePlayerFromQueue(client);
      this.gameService.removePlayerFromQueue(freindSocket);
      await this.engineService.createGameSimulation(room);
      this.engineService.sendPosition(room, this.endGameSimulation.bind(this));
      this.engineService.addServerToGame(room.id, this.server);
      client.emit('play-a-friend'); // to avoid sending all the sockets to game
      freindSocket.emit('play-a-friend'); // to avoid sending all the sockets to game
      const data: any = {
        room: room.id,
        leftPlayer: room.players[0].position === 'left' ? room.players[0].username : room.players[1].username,
        rightPlayer: room.players[0].position === 'right' ? room.players[0].username : room.players[1].username,
      }
      client.emit('game-info', data);
      client.emit('refresh-page');
    }
  }

  @SubscribeMessage('retry-game')
  handleRetryGame(client: Socket, data: any) {
    if (client.data.username === data.reciever || this.gameService.isInGame(data.reciever) !== null)
      return;
    this.server.to(data.reciever.toString()).emit('retry-game', {sender: client.data.username, senderSocketId: client.id});
  }

  @SubscribeMessage('accept-retry')
  async handleAcceptRetry(client: Socket, data: any) {
    // if invited is already accepted
    // send the player to the game direct without creating a new room
    if (this.gameService.isInGame(client.data.username) !== null){
      return;
    }
    const freindSocket: Socket = this.server.sockets.sockets.get(data.senderSocketId);
    const player1: string = client.data.username;
    const player2: string = data.senderUsername;
    const socket1: Array<Socket> = Array<Socket>(client);
    const socket2: Array<Socket> = Array<Socket>(freindSocket);
    const room: Room = this.gameService.creatRoom(socket1, socket2, player1, player2);
    
    if (room) {
      this.gameService.removePlayerFromQueue(client);
      this.gameService.removePlayerFromQueue(freindSocket);
      await this.engineService.createGameSimulation(room);
      this.engineService.sendPosition(room, this.endGameSimulation.bind(this));
      this.engineService.addServerToGame(room.id, this.server);
      const data: any = {
        room: room.id,
        leftPlayer: room.players[0].position === 'left' ? room.players[0].username : room.players[1].username,
        rightPlayer: room.players[0].position === 'right' ? room.players[0].username : room.players[1].username,
      }
      client.emit('game-info', data);
      freindSocket.emit('game-info', data);
      client.emit('refresh-page');
      freindSocket.emit('refresh-page');
    }
  }

  @SubscribeMessage('rightPaddle')
  handlerPaddle(client: Socket, data: any) {
    this.engineService.setRightBoardPosition(data.room, data.direction);
  }
  
  @SubscribeMessage('leftPaddle')
  handlelPaddle(client: Socket, data: any) {
    this.engineService.setLeftBoardPosition(data.room, data.direction);
  }

  @SubscribeMessage('full-Game')
  handleFullGame(client: Socket, data: string) {
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
    let winner: string;
    let loser: string;
    let room: Room = this.gameService.findRoom(data.room);
	
    if (room.players[0].username === data.player){
    	winner = room.players[1].position;
      loser = room.players[0].position;
    }
    else{
    	winner = room.players[0].position;
      loser = room.players[1].position;
    }
    this.server.to(data.room).emit('winner', winner);
    this.engineService.setLoser(data.room, loser);
    this.endGameSimulation(data.room);
  }
  
  @SubscribeMessage('looking-for-match')
  async handleLookingForMatch(client: Socket, user: string) {
    let found: Room | null;
    this.gameService.addPlayerToQueue(client);
    found = this.gameService.findMatch();
    if (found !== null) {
      await this.engineService.createGameSimulation(found);
      this.engineService.sendPosition(found, this.endGameSimulation.bind(this));
      this.engineService.addServerToGame(found.id, this.server);
    }
  }

  @SubscribeMessage('player-status')
  handleAlreadyLooking(client: Socket, data: any) {
    let roomId: string | null;

    if (roomId = this.gameService.isInGame(data)){
      client.join(roomId);
      client.emit('player-status', 'already-playing');
    }
    else 
      client.emit('player-status', 'not-looking');
  }
}
