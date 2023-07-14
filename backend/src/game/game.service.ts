import { Injectable } from "@nestjs/common";
import { Socket } from "socket.io";
import { Player } from "./interfaces/player.interface";
import { Room } from "./interfaces/room.interface";

@Injectable()
export class gameService{
  private matchmakingQueue: Array<Socket> = [];
  private rooms: Map<string, Array<Socket>> = new Map<string, Array<Socket>>();

  addPlayerToQueue(playerSocket: Socket) {
    this.matchmakingQueue.push(playerSocket);
  }

  matchPlayers(): string | null {
    if (this.matchmakingQueue.length >= 2) {
      const player1 = this.matchmakingQueue.shift();
      const player2 = this.matchmakingQueue.shift();
      if (player1 && player2) {
        const roomID = `${player1.id}+${player2.id}`;
        this.rooms.set(roomID, [player1, player2]);
        player1.join(roomID);
        player2.join(roomID);
        console.log(`Room created: ${roomID}`);
        return roomID;
      }
    }
    return null;
  }

  informPlayers(event: string) {
    this.rooms.forEach((players, roomID) => {
      players.forEach((player) => {
        player.emit(event, roomID);
      });
    });
  }
  //TODO: create rooms array and create room and delete room functions

  // printQueue(): void {
  //   if (this.matchmakingQueue.length === 2) {
  //   console.log(`Queue: ${this.matchmakingQueue.map((player) => player.id)}`);
  //   }
  // }

  // printRooms(): void {
  //   if (this.rooms.size > 0) {
  //   console.log(`Rooms: ${Array.from(this.rooms.keys())}`);
  //   }
  // }
}