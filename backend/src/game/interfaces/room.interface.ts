import { Player } from './player.interface';

export interface Room {
	id: string;
	players: Array<Player>;
}
