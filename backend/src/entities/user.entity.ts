import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
    ManyToMany,
    JoinTable,
    Index,
    CreateDateColumn
  } from 'typeorm';
  
import {  Channel, Message, Mutation, Bannation, Membership } from './channel.entity';
  
export enum Status {
    ONLINE = 'online',
    OFFLINE = 'offline',
    INGAME = 'in game'
}
  
@Entity({ name: 'User' })
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: true})
    @Index({unique: true})
    email: string;

    @Column({ length: 10, nullable: true})
    @Index({unique: true})
    username: string;

    @Column({nullable: true})
    image: string;

    @Column({
        nullable: true,
    })
    baner: string;
    
    @Column('text' , { nullable: true })
    status: Status;
    
    @Column('decimal', { precision: 6, scale: 2, nullable: true})
    level: number;
    
    @Column({nullable: true})
    XP: number;

    @Column({ nullable: true })
    wins: number;

    @Column({ nullable: true })
    loses: number;


    @Column({ type: 'boolean', nullable: true})
    fact2Auth: boolean;

    @Column({ nullable: true , select: false})
    fact2Secret: string;
    
    @OneToMany(() => Channel, channel => channel.owner)
    ownedChannels: Channel[];
    
    @OneToMany(() => Membership, membership => membership.member)
    // @JoinTable()
    memberships: Membership[];
    
    @OneToMany(() => Friendship, (friendship) => friendship.initiater)
    initiatedFriendships: Friendship[];
    
    @OneToMany(() => Friendship, (friendship) => friendship.receiver)
    receivedFriendships: Friendship[];
    
    @OneToMany(() => Blockage, (blockage) => blockage.blocker)
    blockedUsers: User[];
    
    @OneToMany(() => Blockage, (blockage) => blockage.blocked)
    blockedByUsers: User[];
    
    @OneToMany(() => Mutation, (mutation) => mutation.member)
    mutations: Mutation[];
    
    @OneToMany(() => GameHistory, (gameHistory) => gameHistory.winner)
    wonGames: GameHistory[];
    
    @OneToMany(() => GameHistory, (gameHistory) => gameHistory.loser)
    lostGames: GameHistory[];
    
    @OneToMany(() => Message, (message) => message.sender)
    messages: Message[];

    @OneToMany(() => Bannation, (bannation) => bannation.member)
    bannations: Bannation[];
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
  
    @CreateDateColumn()
    created_at: Date;
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

export enum Fstatus {
    PENDING = 'pending',
    ACCEPTED = 'accepted',
    NONE = 'none'
}

@Entity({ name: 'Friendship' })
export class Friendship {
    @PrimaryGeneratedColumn()
    id: number;
    
    @ManyToOne(() => User, (user) => user.initiatedFriendships)
    initiater: User;
  
    @ManyToOne(() => User, (user) => user.receivedFriendships)
    receiver: User;
  
    @Column( )
    status: Fstatus;
}