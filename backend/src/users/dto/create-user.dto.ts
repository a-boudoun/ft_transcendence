import { AdministrationDTO, ChannelDTO, MessageDTO, SanctionDTO } from "src/channels/dto/create-channel.dto";
import { Status } from "../../entities/user.entity";

export class UserDTO {
    id: number;
    username: string;
    name: string;
    image: string;
    status: Status;
    fact2Auth: boolean;
    level: number;
    XP: number;
    ownedChannels: ChannelDTO[];
    channels: ChannelDTO[];
    initiatedFriendships: FriendshipDTO[];
    receivedFriendships: FriendshipDTO[];
    blockedUsers: UserDTO[];
    blockedByUsers: UserDTO[];
    sanctions: SanctionDTO[];
    wonGames: GameHistoryDTO[];
    lostGames: GameHistoryDTO[];
    messages: MessageDTO[];
    administratedChannels: AdministrationDTO[];
}


export class GameHistoryDTO {
    winner: UserDTO;
    loser: UserDTO;
    loserScore: number;
    createdAt: Date;
}

export class BlockageDTO {
    blocker: UserDTO;
    blocked: UserDTO;
}


export class FriendshipDTO {
    initiater: UserDTO;
    receiver: UserDTO;
    isAccepted: boolean;
}
