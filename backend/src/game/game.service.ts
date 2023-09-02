import { Injectable } from "@nestjs/common";
import { Socket } from "socket.io";
import { Player } from "./interfaces/player.interface";
import { Room } from "./interfaces/room.interface";

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
  
  addPlayerToQueue(playerSocket: Socket): void {
    const username: string = playerSocket.data.username;
    if (this.matchMakingQue.has(username)) {
      this.matchMakingQue.get(username).push(playerSocket);
    }
    else {
      this.matchMakingQue.set(username, [playerSocket]);
    }
  }
  
  findRoomByPlayer(user: string): Room | undefined {
    const room: Room | undefined = Array.from(this.rooms.values()).find((room: Room) => {
      return room.players.find((player: Player) => player.username === user);
    });
    return room;
  }
  
  removePlayerFromQueue(client: Socket): void {
    this.matchMakingQue.delete(client.data.username);
  }
  
  removeRoom(roomId: string): void {
    const room: Room | undefined = this.findRoom(roomId);
    if (room)
    this.rooms.delete(roomId);
}

findRoom(roomId: string): Room | undefined {
  return this.rooms.get(roomId);
}

removePlayerFromRoom(username: string, roomId: string) : boolean {
  
  const room: Room | undefined = this.findRoom(roomId);
  if (!room)
  return false;
let index: number = -1;
if (room.players[0] && room.players[0].username === username) {
  index = 0;
}
else if (room.players[1] && room.players[1].username === username) {
  index = 1;
}
if (index !== -1)
room.players.splice(index, 1);
if (room.players.length === 0) {
  this.removeRoom(room.id);
  return true;
}
return false;
}

emitToplayer(username: string, event: string, data?: any): void
{
  const player: Array<Socket> | undefined = this.matchMakingQue.get(username);
  if (player) {
    player.forEach((socket: Socket) => {
      socket.emit(event, data);
    });
  }
}

creatRoom(socket1: Array<Socket>, socket2: Array<Socket>, user1:string, user2:string): Room
{
  const player1: Player = {sockets: socket1, username: user1, position: 'left'};
  const player2: Player = {sockets: socket2, username: user2, position: 'right'};
  
  const room : Room = {id: `${user1}+${user2}`, players: [player1, player2]};
  if (player1 && player2) {
    this.rooms.set(room.id, room);
    
    socket1.forEach((socket: Socket) => {
      socket.join(room.id);
    });
    
    socket2.forEach((socket: Socket) => {
      socket.join(room.id);
    });
  }
  return room;
}

findMatch() : Room | null{
  if (this.matchMakingQue.size >= 2) {
    const iterator: any = this.matchMakingQue.entries();
    const [username1, sockets1] = [...iterator.next().value];
    const [username2, sockets2] = [...iterator.next().value];
    
    this.matchMakingQue.delete(username1);
    this.matchMakingQue.delete(username2);
    
    sockets1.forEach((socket: Socket) => {
      socket.emit('match-found', username2);
    });
    sockets2.forEach((socket: Socket) => {
      socket.emit('match-found', username1);
    });
    return this.creatRoom(sockets1, sockets2, username1, username2);
  }
  return null;
}

isInGame(username: string): string | null { 
  const room: Room | undefined = Array.from(this.rooms.values()).find((room: Room) => {
    return room.players.find((player: Player) => player.username === username);
  });
  if (room) {
    return room.id;
  }
  return null;

}

}