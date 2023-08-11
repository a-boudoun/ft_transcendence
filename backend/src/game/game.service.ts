import { Injectable } from "@nestjs/common";
import { Socket } from "socket.io";
import { Player } from "./interfaces/player.interface";
import { Room } from "./interfaces/room.interface";
import { SocketReadyState } from "net";

@Injectable()
export class gameService{
  private matchMakingQue: Map< string, Array<Socket>> = new Map<string, Array<Socket>>();
  private rooms: Map<string, Room> = new Map<string, Room>();

  isInQueue(client: Socket): boolean {
    const present : boolean = this.matchMakingQue.has(client.data.username);
    if (present) {
      this.matchMakingQue.get(client.data.username).push(client);
    }
    return present;
  }

  // TODO: it maybe cause some problems
  // because when you refresh the button still apears before receiving the 'already-looking' or 'ingame' event
  addPlayerToQueue(playerSocket: Socket) {
    const username: string = playerSocket.data.username;
    if (this.matchMakingQue.has(username)) {
      this.matchMakingQue.get(username).push(playerSocket);
    }
    else {
      this.matchMakingQue.set(username, [playerSocket]);
    }
  }

  removePlayerFromQueue(client: Socket) {
   this.matchMakingQue.delete(client.data.username);
  }

  // removePlayer(playerSocket: Socket) : string | null {
  //   const index: number = this.matchmakingQue.indexOf(playerSocket);
  //   if (index > -1) {
  //     this.matchmakingQue.splice(index, 1);
  //   }
  //   else{
  //     const room: Room | undefined = this.findRoomByPlayer(playerSocket);
  //     if (room) {
  //       this.removePlayerFromRoom(playerSocket, room);
  //       if (room.players.length === 0) {
  //         this.removeRoom(room.id);
  //         return room.id;
  //       }
  //     }
  //   }
  //   return null;
  // }
  // TODO add a function to find the user's room based on his username

  // findRoomByPlayer(user: string): Room | undefined {
  //   const room: Room | undefined = Array.from(this.rooms.values()).find((room: Room) => {
  //     return room.players.find((player: Player) => player.username === user);
  //   });
  //   return room;
  // }

  // findRoom(roomId: string): Room | undefined {
  //   return this.rooms.get(roomId);
  // }

  // removeRoom(roomId: string) {
  //   this.rooms.delete(roomId);
  // }

  // removePlayerFromRoom(playerSocket: Socket, room: Room) {
  //   const index: number = room.players.findIndex((player: Player) => player.socket === playerSocket);
  //   if (index > -1) {
  //     room.players.splice(index, 1);
  //   }
  // }

  creatRoom(socket1: Socket, socket2: Socket): Room
  {
      const player1: Player = {socket: socket1, username: socket1.data.username};
      const player2: Player = {socket: socket2, username: socket2.data.username};

      const room : Room = {id: `${socket1.id}+${socket2.id}`, players: [player1, player2]};
      if (player1 && player2) {
        this.rooms.set(room.id, room);
        socket1.join(room.id);
        socket2.join(room.id);
      }
      return room;
  }

  findMatch() : Room | null{
    if (this.matchMakingQue.size >= 2) {
      
    }
    return null;
  }
  // sending the room id and the users in the room to the players
  // informPlayers(event: string, room: Room) {
  //   if (room) {
  //     const users = room.players.map((player) => player.username);
  //     room.players.forEach((player) => {
  //       player.socket.emit(event, {room: room.id, us: users});
  //     });
  //   }
  // }

  // printQueue(): void {
  //   console.log (this.matchmakingQue.length)
  // }

  isInGame(username: string): boolean {
    const present : boolean = Array.from(this.rooms.values()).find((room: Room) => {
      return room.players.find((player: Player) => player.username === username);
    }) ? true : false;
    return present;
  }
  

  // printRooms(): void {
  //   if (this.rooms.size > 0) {
  //   console.log(`Rooms: ${Array.from(this.rooms.keys())}`);
  //   }
  // }
}