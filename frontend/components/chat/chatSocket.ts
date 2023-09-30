import io from 'socket.io-client';
import { config } from 'dotenv';

config();

export const socket = io(`${process.env.NEXT_PUBLIC_BACKEND_HOST}`, {
    transports: ['websocket'],
});