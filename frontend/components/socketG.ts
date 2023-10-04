import { io } from "socket.io-client";
import { config } from 'dotenv';

config();

const socket = io(`${process.env.NEXT_PUBLIC_BACKEND_HOST}`, {
	autoConnect: true,
	transports: ['websocket'],
});

export default socket;