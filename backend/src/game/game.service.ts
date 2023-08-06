import { Injectable } from "@nestjs/common";
import { Socket } from "socket.io";
import { Player } from "./interfaces/player.interface";
import { Room } from "./interfaces/room.interface";
import { SocketReadyState } from "net";

@Injectable()
export class gameService{
  private matchmakingQueue: Array<Socket> = [];
  private rooms: Map<string, Room> = new Map<string, Room>();

  isInQueue(username: string): boolean {
    const present : boolean = this.matchmakingQueue.find((player: Socket) => player.data.username === username) ? true : false;
    console.log(`username ${username} is in queue: ${present}`);
    return present;
  }

  addPlayerToQueue(playerSocket: Socket) {
    const id: string = playerSocket.data.username;
    const present : boolean = this.isInQueue(id);
    if (!present) {
      this.matchmakingQueue.push(playerSocket);
    }
  }

  removePlayerFromQueue(username: string) {
    const index: number = this.matchmakingQueue.findIndex((player: Socket) => player.data.username === username);
    if (index > -1) {
      this.matchmakingQueue.splice(index, 1);
    }
  }

  removePlayer(playerSocket: Socket) : string | null {
    const index: number = this.matchmakingQueue.indexOf(playerSocket);
    if (index > -1) {
      this.matchmakingQueue.splice(index, 1);
    }
    else{
      const room: Room | undefined = this.findRoomByPlayer(playerSocket);
      if (room) {
        this.removePlayerFromRoom(playerSocket, room);
        if (room.players.length === 0) {
          this.removeRoom(room.id);
          return room.id;
        }
      }
    }
    return null;
  }
  // TODO add a function to find the user's room based on his username

  findRoomByPlayer(playerSocket: Socket): Room | undefined {
    const room: Room | undefined = Array.from(this.rooms.values()).find((room: Room) => {
      return room.players.find((player: Player) => player.socket === playerSocket);
    });
    return room;
  }

  findRoom(roomId: string): Room | undefined {
    return this.rooms.get(roomId);
  }

  removeRoom(roomId: string) {
    this.rooms.delete(roomId);
  }

  removePlayerFromRoom(playerSocket: Socket, room: Room) {
    const index: number = room.players.findIndex((player: Player) => player.socket === playerSocket);
    if (index > -1) {
      room.players.splice(index, 1);
    }
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
        this.informPlayers('roomCreated', room);
        return room.id;
      }
    }
    return null;
  }

  findMatch() : boolean{
    if (this.matchmakingQueue.length >= 2) {
      const socket1: Socket = this.matchmakingQueue.shift();
      const socket2: Socket = this.matchmakingQueue.shift();
      
      const user1: string = socket1.data.username;
      const user2: string = socket2.data.username;

      socket1.emit('match-found', user2);
      socket2.emit('match-found', user1);
      return true;
    }
    return false;
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