import {configureStore} from '@reduxjs/toolkit';
import currentChannelReducer from './features/currentChannel';
export const store = configureStore({
    reducer: {
        currentChannel: currentChannelReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;