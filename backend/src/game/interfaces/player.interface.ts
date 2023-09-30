import { Socket } from 'socket.io';
export interface Player {
	position: string;
	sockets: Array<Socket>;
	username: string;
}
