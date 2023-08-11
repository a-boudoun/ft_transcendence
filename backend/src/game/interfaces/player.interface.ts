import { Socket } from 'socket.io';
import { User } from '../../interfaces/User';
export interface Player {
	socket: Array<Socket>;
	username: string | string[];
}
