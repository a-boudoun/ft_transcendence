
import Channel from '@/components/chat/Channel';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import { type } from 'os';
import { set } from 'zod';

type InitialState = {
    channel: Channel;
    channels: Channel[];
    user: userDto;
    isopen: boolean;
    isMid: boolean;
    isChild: boolean;
    modalTYpe: string;
    visitedUser: userDto;
    Membership: any[];
    isNewMember: boolean;
};

interface Message {
    content: string;
    sender: userDto;
    date: string;
}
type userDto  = {
    id: number;
    username: string; 
    name: string;
    image: string;
    fact2Auth: boolean;
    level: number;
    XP: number;

}
type Channel = {
    id: number;
    name: string;
    image: string;
    type: string;
    password: string;
    messages: Message[];
    memberships: any[];
    bannations: any[];
};
const initialState = {

    channel:{} as Channel,
    channels: [] as Channel[],
    user: {} as userDto,
    isopen: false,
    isMid: true,
    isChild: false,
    modalTYpe: '',
    visitedUser: {} as userDto,
    Membership: [] as any[],
    isNewMember: false,

} as InitialState

export const currentChannelSlice = createSlice({
    name: 'currentChannel',
    initialState,
    reducers: {
        setcurrentChannel: (state , action: PayloadAction<any>) => {
            state.channel  = action.payload;
            state.channel.messages = state.channel.messages.sort((a, b) => new Date(a.date) - new Date(b.date));
        },
        setMessage: (state: any, action: PayloadAction<any>) => {
            state.channel.messages.push(action.payload );
        },
        setChannels: (state: any, action: PayloadAction<any>) => {
            state.channels = action.payload;
        },
        setnewchannel: (state: any, action: PayloadAction<any>) => {
            state.channels.unshift(action.payload);
        },
        setisopen: (state: any, action: PayloadAction<any>) => {
            state.isopen = action.payload;
        },
        setuser: (state: any, action: PayloadAction<any>) => {
            state.user = action.payload;
        },
        setMembership: (state: any, action: PayloadAction<any>) => {
            state.channels.find((channel: any) => channel.id === state.channel.id).memberships.push(action.payload);
        },
        setisMid: (state: any, action: PayloadAction<any>) => {
            state.isMid = action.payload;
        },
        setisChild: (state: any, action: PayloadAction<any>) => {
            state.isChild= action.payload;
        },
        setmodaltype: (state: any, action: PayloadAction<any>) => {
            state.modalTYpe = action.payload;
        },
        setVisitedUser: (state: any, action: PayloadAction<any>) => {
            state.visitedUser = action.payload;
        },
        setMemberships: (state: any, action: PayloadAction<any>) => {
            state.Membership = action.payload;
        },
        setisNewMember: (state: any, action: PayloadAction<any>) => {
            state.isNewMember = action.payload;
        },
    }
})

export const {setcurrentChannel,setisNewMember, setMessage,setMemberships, setVisitedUser, setChannels, setnewchannel, setisopen, setuser, setMembership, setisMid, setisChild, setmodaltype} = currentChannelSlice.actions;
export default currentChannelSlice.reducer;