import { Socket } from 'socket.io';
import { User } from '../../interfaces/User';
export interface Player {
	socket: Socket;
	username: string | string[];
}
