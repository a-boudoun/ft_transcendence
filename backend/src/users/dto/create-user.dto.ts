import { ChannelDTO, MessageDTO, MutationDTO} from "src/channels/dto/create-channel.dto";
import { Status } from "../../entities/user.entity";
import { FriendshipDTO } from "src/friendship/dto/create-friendship.dto";
import {
    IsNotEmpty,
    IsString,
    MinLength,
    IsInt,
    IsBoolean,
    IsNumber,
    IsEnum,
    MaxLength,
    IsNumberString
  } from 'class-validator';

export class UserDTO {
    @IsInt()
    id: number;
    
    @IsInt()
    intraID: number; 

    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    @MaxLength(10)
    username: string;

    @IsString()
    image: string;

    @IsString()
    baner: string;

    @IsEnum(Status)
    status: Status;

    @IsNumberString()
    level: number;

    @IsInt()
    XP: number;

    @IsNumber()
    wins: number;

    @IsInt()
    loses: number;

    @IsBoolean()
    fact2Auth: boolean;

    @IsString()
    fact2Secret: string;

    ownedChannels: ChannelDTO[];
    channels: ChannelDTO[];
    initiatedFriendships: FriendshipDTO[];
    receivedFriendships: FriendshipDTO[];
    blockedUsers: UserDTO[];
    blockedByUsers: UserDTO[];
    mutations: MutationDTO[];
    messages: MessageDTO[];
}

export class BlockageDTO {
    blocker: UserDTO;
    blocked: UserDTO;
}