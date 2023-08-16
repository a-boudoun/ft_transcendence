import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
    ManyToMany,
    JoinTable,
    Index,
    DataSource,
    CreateDateColumn
  } from 'typeorm';
import { Administration, Channel, Message, Sanction } from './channel.entity';
  
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
    @Index({unique: true})
    username: string;

    @Column({unique: true})
    name: string;

    
    @Column({nullable: true,})
    image: string;

    @Column({
        nullable: true,
    })
    baner: string;
    
    @Column('text' , { nullable: true })
    status: Status;
    
    @Column({ type: 'boolean', nullable: true})
    fact2Auth: boolean;
    
    @Column()
    level: number;
    
    @Column()
    XP: number;

    @Column({ nullable: true })
    fact2Secret: string;
    
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
    blockedUsers: User[];
    
    @OneToMany(() => Blockage, (blockage) => blockage.blocked)
    blockedByUsers: User[];
    
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
    REFUSED = 'refused'
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
export { Channel };