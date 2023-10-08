import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
    CreateDateColumn,
  } from 'typeorm';
  
import { User } from './user.entity';
  
export enum ChannelType {
    DIRECT = 'Direct',
    PUBLIC = 'Public',
    PRIVATE = 'Private',
    PROTECTED = 'Protected'
}
export enum MemberTitle {
    MEMBER = 'member',
    ADMIN = 'admin',
    OWNER = 'owner'
}

@Entity({ name: 'Channel' })
export class Channel {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column({ length: 25 })
    name: string;
    
    @Column()
    image : string;

    @Column('text')
    type: ChannelType;
    
    @ManyToOne(() => User, user => user.ownedChannels)
    owner: User;
    
    @Column({nullable : true})
    password: string;
    
    @OneToMany(() => Membership, membership => membership.channel)
    memberships: Membership[];
    
    @OneToMany(() => Mutation, mutation => mutation.channel)
    mutations: Mutation[];
    
    @OneToMany(() => Message, message => message.channel)
    messages: Message[];

    @OneToMany(() => Bannation, bannation => bannation.channel)
    bannations: Bannation[];

}

@Entity({ name: 'Bannation' })
export class Bannation {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Channel, (channel) => channel.bannations, {
        onDelete: 'CASCADE',
    })
    channel: Channel;

    @ManyToOne(() => User, (user) => user.bannations)
    member: User;
}

@Entity({ name: 'Message', orderBy: { date: 'ASC' } })
export class Message {
    @PrimaryGeneratedColumn()
    id: number;
    
    @CreateDateColumn()
    date: Date;
  
    @ManyToOne(() => Channel, (channel) => channel.messages, {
        onDelete: 'CASCADE',
    })
    channel: Channel;
  
    @ManyToOne(() => User, (user) => user.messages)
    sender: User;
  
    @Column()
    content: string;
}


@Entity({ name: 'Membership' })
export class Membership {
    @PrimaryGeneratedColumn()
    id: number;
    
    @ManyToOne(() => Channel, (channel) => channel.memberships, {
        onDelete: 'CASCADE',
    })
    channel: Channel;
    
    @ManyToOne(() => User, (user) => user.memberships)
    member: User;

    @Column({ length: 25 })
    title: MemberTitle;
}

@Entity({ name: 'Mutation' })
export class Mutation {
    @PrimaryGeneratedColumn()
    id: number;
    
    @ManyToOne(() => Channel, (channel) => channel.mutations, {
        onDelete: 'CASCADE',
    })
    channel: Channel;
    
    @ManyToOne(() => User, (user) => user.mutations)
    member: User;

    @Column({ type: 'timestamp' })
    mut_date: Date;
    
    @Column()
    duration: number;
}
