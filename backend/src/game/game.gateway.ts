import { SubscribeMessage, WebSocketGateway, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { gameService } from './game.service';
import { engineService } from './engine.service';
import { Room } from './interfaces/room.interface';

//Cross-Origin-Resource-Sharing (CORS) is a mechanism that uses additional HTTP headers to tell browsers 
//to give a web application running at one origin,
//access to selected resources from a different origin
@WebSocketGateway()
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
    const username : string = client.handshake.headers.cookie.split('_username=')[1];
    client.data.username = username;
    client.join(username);
  }
  
  handleDisconnect(client: Socket) {
  }

  @SubscribeMessage('invite-freind')
  handleInviteFreind(client: Socket, data: any) {
    //TODO: data = {reciever: string, sender: string, senderSocketId: string}
    //TODO: check if player is online and not in game
    this.server.to(data.reciever).emit('game-invitation', {sender: data.sender.username, senderSocketId: client.id});
  }

  @SubscribeMessage('accept-invite')
  handleAcceptInvite(client: Socket, data: any) {
    //  TODO data = {senderUsername: string, senderSocketId: string }
    const freindSocket: Socket = this.server.sockets.sockets.get(data.senderSocketId);
    const player1: string = client.data.username;
    const player2: string = data.senderUsername;
    const socket1: Array<Socket> = Array<Socket>(client);
    const socket2: Array<Socket> = Array<Socket>(freindSocket);
    const room: Room = this.gameService.creatRoom(socket1, socket2, player1, player2);
    
    if (room) {
      this.engineService.createGameSimulation(room.id);
      this.engineService.sendPosition(room);
      this.engineService.addServerToGame(room.id, this.server);
      client.emit('play-a-friend');
      freindSocket.emit('play-a-friend');
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
  handleFullGame(client: Socket, data: any) {
    // client.data.username = data;
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
    let room: Room = this.gameService.findRoom(data.room);
    if (room.players[0].username === data.player)
      winner = room.players[1].position;
    else
      winner = room.players[0].position;
    this.server.to(data.room).emit('left-game', data.player);
    this.server.to(data.room).emit('winner', winner);
  }

  @SubscribeMessage('end-game')
  handleCancelLooking(client: Socket, data: any) {
    this.gameService.removePlayerFromRoom(data.player, data.room);
    this.gameService.removeRoom(data.room);
    this.engineService.removeGameSimulation(data.room);
  }
  
  @SubscribeMessage('looking-for-match')
  handleLookingForMatch(client: Socket, user: string) {
    // client.data.username = user;
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

    // client.data.username = data;
    if (this.gameService.isInQueue(client)){
      client.emit(data, 'player-status', 'already-looking');
    }
    else if (roomId = this.gameService.isInGame(data)){
      client.join(roomId);
      client.emit('player-status', 'already-playing');
    }
    else 
      client.emit('player-status', 'not-looking');
  }
}
