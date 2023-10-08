import { ChannelType, MemberTitle} from "src/entities/channel.entity";
import { UserDTO } from "src/users/dto/create-user.dto";
import {
    IsString,
    IsInt,
    IsDate,
    Validate,
    IsNotEmpty,
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

export class ChannelDTO {
    @IsString()
    name?: string;

    @IsString()
    @Validate(IsValidImageFormat, {
        message: 'Invalid image format. Supported formats are: .jpg, .jpeg, .png, and .webp',
    })
    image?: string;

    type?: ChannelType;
    
    @IsString()
    password?: string;

    owner?: UserDTO;
    memberships?: MembershipDTO[];
    mutations?: MutationDTO[];
    messages?: MessageDTO[];
}


export class MembershipDTO {
    channel: ChannelDTO;
    member: UserDTO;
    title: MemberTitle;
}

export class MutationDTO {
    channel: ChannelDTO;
    member: UserDTO;
    @IsDate()
    mut_date: Date;

    @IsInt()
    duration: number;
}

export class BannationDTO {
    channel: ChannelDTO;
    member: UserDTO;
}

export class MessageDTO {
    channel: ChannelDTO;
    sender: UserDTO;
    @IsString()
    @IsNotEmpty()
    content: string;
}
