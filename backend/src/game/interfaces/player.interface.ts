import { Socket } from 'socket.io';
import { User } from '../../interfaces/User';
export interface Player {
	position: string;
	sockets: Array<Socket>;
	username: string;
}
