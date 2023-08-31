import { ChannelType, MemberTitle, SanctionType } from "src/entities/channel.entity";
import { UserDTO } from "src/users/dto/create-user.dto";

export class ChannelDTO {
    name?: string;
    image?: string;
    type?: ChannelType;
    password?: string;
    owner?: UserDTO;
    administrators?: AdministrationDTO[];
    memberships?: MembershipDTO[];
    sanctions?: SanctionDTO[];
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

export class SanctionDTO {
    channel: ChannelDTO;
    member: UserDTO;
    type: SanctionType;
    duration: Date;
}

export class MessageDTO {
    channel: ChannelDTO;
    sender: UserDTO;
    content: string;
}
