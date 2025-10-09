import { configureStore } from "@reduxjs/toolkit";

import docReducer from './docSlice';


export const store = configureStore({
    reducer: {
        doc: docReducer
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

