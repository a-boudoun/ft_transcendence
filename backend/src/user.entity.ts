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
  
export enum Status {
    ONLINE = 'online',
    OFFLINE = 'offline',
    INGAME = 'ingame'
}
  
@Entity({ name: 'User' })
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 25 })
    @Index({ unique: true })
    pseudo: string;

    @Column('text')
    status: Status;

    @Column({ type: 'boolean' })
    fact2Auth: boolean;

    @Column()
    level: number;

    @Column()
    XP: number;

    @OneToMany(() => Channel, channel => channel.owner)
    ownedChannels: Channel[];

    @ManyToMany(() => Channel, channel => channel.memberships)
    @JoinTable()
    channels: Channel[];

    @OneToMany(() => Friendship, (friendship) => friendship.initiater)
    initiatedFriendships: Friendship[];

    @OneToMany(() => Friendship, (friendship) => friendship.receiver)
    receivedFriendships: Friendship[];

    @OneToMany(() => Blockage, (blockage) => blockage.blocker)
    blockedUsers: Blockage[];

    @OneToMany(() => Blockage, (blockage) => blockage.blocked)
    blockedByUsers: Blockage[];

    @OneToMany(() => Sanction, (sanction) => sanction.member)
    sanctions: Sanction[];

    @OneToMany(() => GameHistory, (gameHistory) => gameHistory.winner)
    wonGames: GameHistory[];

    @OneToMany(() => GameHistory, (gameHistory) => gameHistory.loser)
    lostGames: GameHistory[];

    @OneToMany(() => Message, (message) => message.sender)
    messages: Message[];

    @OneToMany(() => Administration, (administration) => administration.admin)
    administratedChannels: Administration[];
}

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
    
    @Column('text')
    type: ChannelType;
    
    @ManyToOne(() => User, user => user.ownedChannels)
    owner: User;
    
    @Column({ length: 25 })
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
    
@Entity({ name: 'GameHistory' })
export class GameHistory {
    @PrimaryGeneratedColumn()
    id: number;
    
    @ManyToOne(() => User, (user) => user.wonGames)
    winner: User;
  
    @ManyToOne(() => User, (user) => user.lostGames)
    loser: User;
  
    @Column()
    loserScore: number;
  
    @Column({ type: 'timestamp' })
    createdAt: Date;
}
  
@Entity({ name: 'Blockage' })
export class Blockage {
    @PrimaryGeneratedColumn()
    id: number;
    
    @ManyToOne(() => User, (user) => user.blockedUsers)
    blocker: User;
  
    @ManyToOne(() => User, (user) => user.blockedByUsers)
    blocked: User;
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
  
@Entity({ name: 'Friendship' })
export class Friendship {
    @PrimaryGeneratedColumn()
    id: number;
    
    @ManyToOne(() => User, (user) => user.initiatedFriendships)
    initiater: User;
  
    @ManyToOne(() => User, (user) => user.receivedFriendships)
    receiver: User;
  
    @Column({ type: 'boolean' })
    isAccepted: boolean;
}
