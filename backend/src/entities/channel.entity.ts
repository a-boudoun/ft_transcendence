import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
    ManyToMany,
    JoinTable,
    Index,
    DataSource
  } from 'typeorm';
import { User } from './user.entity';
  
export enum ChannelType {
    DIRECT = 'direct',
    PUBLIC = 'public',
    PRIVATE = 'private',
    PROTECTED = 'protected'
}

@Entity({ name: 'Channel' })
export class Channel {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column({ length: 25 })
    @Index({ unique: true })
    name: string;
    
    @Column('text')
    type: ChannelType;
    
    @ManyToOne(() => User, user => user.ownedChannels)
    owner: User;
    
    @Column({ length: 25 ,
    nullable : true})
    password: string;
    
    @OneToMany(() => Administration, administration => administration.channel)
    administrators: Administration[];
    
    @OneToMany(() => Membership, membership => membership.channel)
    memberships: Membership[];
    
    @OneToMany(() => Sanction, sanction => sanction.channel)
    sanctions: Sanction[];
    
    @OneToMany(() => Message, message => message.channel)
    messages: Message[];
}

@Entity({ name: 'Message' })
export class Message {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column({ type: 'timestamp' })
    createdAt: Date;
  
    @ManyToOne(() => Channel, (channel) => channel.messages)
    channel: Channel;
  
    @ManyToOne(() => User, (user) => user.messages)
    sender: User;
  
    @Column({ length: 250 })
    content: string;
}

@Entity({ name: 'Administration' })
export class Administration {
    @PrimaryGeneratedColumn()
    id: number;
    
    @ManyToOne(() => Channel, (channel) => channel.administrators)
    channel: Channel;
    
    @ManyToOne(() => User, (user) => user.administratedChannels)
    admin: User;
}

@Entity({ name: 'Membership' })
export class Membership {
    @PrimaryGeneratedColumn()
    id: number;
    
    @ManyToOne(() => Channel, (channel) => channel.memberships)
    channel: Channel;
    
    @ManyToOne(() => User, (user) => user.channels)
    member: User;
}

export enum SanctionType {
    KICKED = 'kicked',
    BANNED = 'banned',
    MUTED = 'muted'
}

@Entity({ name: 'Sanction' })
export class Sanction {
    @PrimaryGeneratedColumn()
    id: number;
    
    @ManyToOne(() => Channel, (channel) => channel.sanctions)
    channel: Channel;
    
    @ManyToOne(() => User, (user) => user.sanctions)
    member: User;

    @Column('text')
    type: SanctionType;

    @Column({ type: 'date' })
    duration: Date;
}
