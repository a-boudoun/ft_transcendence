import { ChannelType, MemberTitle} from "src/entities/channel.entity";
import { UserDTO } from "src/users/dto/create-user.dto";

export class ChannelDTO {
    name?: string;
    image?: string;
    type?: ChannelType;
    password?: string;
    owner?: UserDTO;
    administrators?: AdministrationDTO[];
    memberships?: MembershipDTO[];
    mutations?: MutationDTO[];
    messages?: MessageDTO[];
}

export class AdministrationDTO {
    channel: ChannelDTO;
    admin: UserDTO;
}

export class MembershipDTO {
    channel: ChannelDTO;
    member: UserDTO;
    title: MemberTitle;
}

export class MutationDTO {
    channel: ChannelDTO;
    member: UserDTO;
    mut_date: Date;
    duration: number;
}

export class BannationDTO {
    channel: ChannelDTO;
    member: UserDTO;
}

export class MessageDTO {
    channel: ChannelDTO;
    sender: UserDTO;
    content: string;
}
