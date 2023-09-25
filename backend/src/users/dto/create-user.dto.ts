import { AdministrationDTO, ChannelDTO, MessageDTO, MutationDTO} from "src/channels/dto/create-channel.dto";
import { Status } from "../../entities/user.entity";
import { FriendshipDTO } from "src/friendship/dto/create-friendship.dto";
import {
    IsNotEmpty,
    IsString,
    MinLength,
    IsInt,
    IsBooleanString,
    IsNumber,
    IsEnum,
    MaxLength
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

    @IsInt()
    level: number;

    @IsInt()
    XP: number;

    @IsNumber()
    wins: number;

    @IsInt()
    loses: number;

    @IsBooleanString()
    fact2Auth: boolean;

    @IsNotEmpty()
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
    administratedChannels: AdministrationDTO[];
}

export class BlockageDTO {
    blocker: UserDTO;
    blocked: UserDTO;
}