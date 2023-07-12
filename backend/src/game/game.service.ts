import { Injectable } from "@nestjs/common";
import { Player } from "./interfaces/player.interface";

@Injectable()
export class gameService{
	private players: Player[] = [];
	createPlayer(player: Player){
		player.id =  
		this.players.push(player);
	}
}
// Todo: create a room service to match two players
/*
import { WebSocketGateway, SubscribeMessage, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class GameWebSocketGateway {
  @WebSocketServer()
  server: Server;

  private rooms: Map<string, Set<Socket>> = new Map();

  @SubscribeMessage('matchPlayers')
  handleMatchPlayers(socket: Socket, data: any) {
    const { playerId1, playerId2 } = data;
    const room = `${playerId1}_${playerId2}`;

    // Create a new room
    this.rooms.set(room, new Set([socket]));

    // Join the room
    socket.join(room);
  }

  @SubscribeMessage('playerMove')
  handlePlayerMove(socket: Socket, data: any) {
    const { room, movement } = data;

    // Broadcast the movement event to all clients in the room
    socket.to(room).emit('playerMoved', movement);
  }

  // Other event handlers...

  handleDisconnect(socket: Socket) {
    // Remove the socket from its associated room
    for (const [room, sockets] of this.rooms.entries()) {
      if (sockets.has(socket)) {
        sockets.delete(socket);
        if (sockets.size === 0) {
          // If the room becomes empty, remove it
          this.rooms.delete(room);
        }
        break;
      }
    }
  }
}
*/
// Todo: create a matchmaking service
/*
export class MatchmakingService {
  private matchmakingQueue: string[] = [];

  addPlayerToQueue(playerId: string) {
    this.matchmakingQueue.push(playerId);
  }

  matchPlayers(): { player1: string, player2: string } | null {
    if (this.matchmakingQueue.length >= 2) {
      const player1 = this.matchmakingQueue.shift();
      const player2 = this.matchmakingQueue.shift();
      return { player1, player2 };
    }
    return null;
  }
}
*/