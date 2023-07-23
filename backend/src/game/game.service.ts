import { Injectable } from "@nestjs/common";
import { Socket } from "socket.io";
import { Player } from "./interfaces/player.interface";
import { Room } from "./interfaces/room.interface";
import { SocketReadyState } from "net";

@Injectable()
export class gameService{
  private matchmakingQueue: Array<Socket> = [];
  private rooms: Map<string, Room> = new Map<string, Room>();

  addPlayerToQueue(playerSocket: Socket) {
    this.matchmakingQueue.push(playerSocket);
  }

  removePlayer(playerSocket: Socket) {
    const index: number = this.matchmakingQueue.indexOf(playerSocket);
    if (index > -1) {
      this.matchmakingQueue.splice(index, 1);
    }
    else{}
  }

  findRoomByPlayer(playerSocket: Socket): Room | undefined {
    const room: Room | undefined = Array.from(this.rooms.values()).find((room: Room) => {
      return room.players.find((player: Player) => player.socket === playerSocket);
    });
    return room;
  }

  findRoom(roomId: string): Room | undefined {
    return this.rooms.get(roomId);
  }

  matchPlayers(): string | null 
  {
    if (this.matchmakingQueue.length >= 2) {
      const socket1: Socket = this.matchmakingQueue.shift();
      const socket2: Socket = this.matchmakingQueue.shift();
      const player1: Player = {socket: socket1, username: socket1.handshake.query.username};
      const player2: Player = {socket: socket2, username: socket2.handshake.query.username};

      const room : Room = {id: `${socket1.id}+${socket2.id}`, players: [player1, player2]};
      if (player1 && player2) {
        this.rooms.set(room.id, room);
        socket1.join(room.id);
        socket2.join(room.id);
        console.log(`Room created: ${room.id}`);
        this.informPlayers('roomCreated', room);
        return room.id;
      }
    }
    return null;
  }

  // sending the room id and the users in the room to the players
  informPlayers(event: string, room: Room) {
    if (room) {
      const users = room.players.map((player) => player.username);
      room.players.forEach((player) => {
        player.socket.emit(event, {room: room.id, us: users});
      });
    }
  }
  //TODO: create rooms array and create room and delete room functions

  printQueue(): void {
    console.log (this.matchmakingQueue.length)
  }

  // printRooms(): void {
  //   if (this.rooms.size > 0) {
  //   console.log(`Rooms: ${Array.from(this.rooms.keys())}`);
  //   }
  // }
}