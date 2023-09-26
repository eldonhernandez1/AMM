import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';

import provider from '../store/reducers/provider';

export const store = configureStore({
    reducer: {
        provider,
    },
    middleware: getDefaultMiddlewarev =>
    getDefaultMiddleware({
        serializableCheck: false,
    }),
});
