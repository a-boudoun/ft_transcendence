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
      this.matchMakingQue.set(username, [
        playerSocket]);
    }
  }
  
  findRoomByPlayer(user: string): Room | undefined {
    for (const room of this.rooms.values()) {
     for (const player of room.players) {
        if (player.username.toString() === user.toString()) {
          return room;
        }
     }
    }
  }
  
  removePlayerFromQueue(client: Socket): void {
    this.matchMakingQue.delete(client.data.username);
  }
  
  removeRoom(roomId: string): void {
    const room: Room | undefined = this.findRoom(roomId);
	
    if (room){
		room.players.splice(0, room.players.length);
		this.rooms.delete(roomId);
	}
}

findRoom(roomId: string): Room | undefined {
  return this.rooms.get(roomId);
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
  const player1: Player = {sockets: socket1, username: user1.toString(), position: 'left'};
  const player2: Player = {sockets: socket2, username: user2.toString(), position: 'right'};
  
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
    const room: Room = this.creatRoom(sockets1, sockets2, username1, username2);
    return room;
  }
  return null;
}

isInGame(username: string): string | null { 
  const room: Room | undefined = Array.from(this.rooms.values()).find((room: Room) => {
    return room.players.find((player: Player) => player.username.toString() === username.toString());
  });
  if (room !== undefined) {
    return room.id;
  }
  return null;
}

}