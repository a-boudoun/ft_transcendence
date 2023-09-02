import { AdministrationDTO, ChannelDTO, MessageDTO, MutationDTO} from "src/channels/dto/create-channel.dto";
import { Status } from "../../entities/user.entity";
import { GameHistoryDTO } from "src/game-history/dto/create-game-history.dto";
import { FriendshipDTO } from "src/friendship/dto/create-friendship.dto";

export class UserDTO {
    id: number;
    username: string;
    name: string;
    image: string;
    baner: string;
    status: Status;
    fact2Auth: boolean;
    level: number;
    XP: number;
    fact2Secret: string;
    ownedChannels: ChannelDTO[];
    channels: ChannelDTO[];
    initiatedFriendships: FriendshipDTO[];
    receivedFriendships: FriendshipDTO[];
    blockedUsers: UserDTO[];
    blockedByUsers: UserDTO[];
    mutations: MutationDTO[];
    wonGames: GameHistoryDTO[];
    lostGames: GameHistoryDTO[];
    messages: MessageDTO[];
    administratedChannels: AdministrationDTO[];
}




export class BlockageDTO {
    blocker: UserDTO;
    blocked: UserDTO;
}



