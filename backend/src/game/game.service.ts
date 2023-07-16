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

  removePlayerFromQueue(playerSocket: Socket) {
    const index = this.matchmakingQueue.indexOf(playerSocket);
    if (index > -1) {
      this.matchmakingQueue.splice(index, 1);
    }
  }

  findRoom(roomId: string): Room | null {
    return this.rooms.get(roomId);
  }

  matchPlayers(): string | null {
    if (this.matchmakingQueue.length >= 2) {
      const player1: Socket = this.matchmakingQueue.shift();
      const player2: Socket = this.matchmakingQueue.shift();
      if (player1 && player2) {
        const roomID = `${player1.id}+${player2.id}`;
        this.rooms.set(roomID, [player1, player2]);
        player1.join(roomID);
        player2.join(roomID);
        console.log(`Room created: ${roomID}`);
        this.informPlayers('roomCreated', roomID);
        return roomID;
      }
    }
    return null;
  }

  informPlayers(event: string, roomID: string) {
    this.rooms.forEach((players, roomID) => {
      players.forEach((player) => {
        player.emit(event, roomID);
      });
    });
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