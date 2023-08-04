import { AdministrationDTO, ChannelDTO, MessageDTO, SanctionDTO } from "src/channels/dto/create-channel.dto";
import { Status } from "../../entities/user.entity";
import { GameHistoryDTO } from "src/game-history/dto/create-game-history.dto";

export class UserDTO {
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
    sanctions: SanctionDTO[];
    wonGames: GameHistoryDTO[];
    lostGames: GameHistoryDTO[];
    messages: MessageDTO[];
    administratedChannels: AdministrationDTO[];
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
