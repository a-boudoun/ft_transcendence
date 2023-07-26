
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import { type } from 'os';
import { set } from 'zod';

type InitialState = {
    channel: Channel;
};

interface Message {
    content: string;
    from: string;
}

type Channel = {
    id: number;
    name: string;
    image: string;
    type: string;
    password: string;
    messages: Message[];
};
const initialState = {
    channel: {
    id: 0,
    name: '',
    image: '',
    type: '',
    password: '',
    messages: [],
    } as Channel,

    channels: [] as Channel[],

} as InitialState

export const currentChannelSlice = createSlice({
    name: 'currentChannel',
    initialState,
    reducers: {
        resetcurrent:() =>{
            return initialState;
        },
        setcurrentChannel: (state, action: PayloadAction<any>) => {
            state.channel.id = action.payload.id;
            state.channel.name = action.payload.name;
            state.channel.image = action.payload.image;
            state.channel.type = action.payload.type;
            state.channel.password = action.payload.password;
            // state.channel.messages = action.payload.messages;

        },
        setMessage: (state, action: PayloadAction<any>) => {
            state.channel.messages.push(action.payload);
        },
        setChannels: (state, action: PayloadAction<any>) => {
            state.channels = action.payload;
            return ;
        },
        setnewchannel: (state, action: PayloadAction<any>) => {
            console.log("hefuckllo ", action.payload);
            state.channels = [...state.channels, action.payload];

            return ;
        }

    }
})


export const {setcurrentChannel, resetcurrent, setMessage, setChannels, setnewchannel} = currentChannelSlice.actions;
export default currentChannelSlice.reducer;