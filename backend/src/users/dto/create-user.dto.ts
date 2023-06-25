import { ChannelType, SanctionType, Status } from "../entities/user.entity";

export class UserDTO {
    username: string;
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

export class ChannelDTO {
    name: string;
    type: ChannelType;
    owner: UserDTO;
    password: string;
    administrators: AdministrationDTO[];
    memberships: MembershipDTO[];
    sanctions: SanctionDTO[];
    messages: MessageDTO[];
}

export class AdministrationDTO {
    channel: ChannelDTO;
    admin: UserDTO;
}

export class MembershipDTO {
    channel: ChannelDTO;
    member: UserDTO;
}

export class SanctionDTO {
    channel: ChannelDTO;
    member: UserDTO;
    type: SanctionType;
    duration: Date;
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

export class MessageDTO {
    createdAt: Date;
    channel: ChannelDTO;
    sender: UserDTO;
    content: string;
}

export class FriendshipDTO {
    initiater: UserDTO;
    receiver: UserDTO;
    isAccepted: boolean;
}
