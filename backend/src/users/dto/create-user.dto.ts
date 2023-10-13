import { ChannelDTO, MembershipDTO, MessageDTO, MutationDTO} from "src/channels/dto/create-channel.dto";
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
    IsNumberString,
    Validate,
  } from 'class-validator';

function is_valid_image(filename: string): boolean {
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'webp'];
    const fileExtension = filename.split('.').pop();

    if (fileExtension && allowedExtensions.includes(fileExtension.toLowerCase())) {
        return true;
    }
 
    return false;
}

function IsValidImageFormat(value: string) {
    if (!is_valid_image(value)) {
        return false;
    }
    return true;
}

export class UserDTO {
    @IsInt()
    id: number;
    
    @IsString()
    email: string; 

    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    @MaxLength(10)
    username: string;

    @IsString()
    @Validate(IsValidImageFormat, {
        message: 'Invalid image format. Supported formats are: .jpg, .jpeg, .png, and .webp',
    })
    image: string;

    @IsString()
    @Validate(IsValidImageFormat, {
        message: 'Invalid banner format. Supported formats are: .jpg, .jpeg, .png, and .webp',
    })
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
    memberships?: MembershipDTO[];
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