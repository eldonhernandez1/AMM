import { configureStore } from '@reduxjs/toolkit';

import provider from '../store/reducers/provider';
import tokens from '../store/reducers/tokens';
import amm from '../store/reducers/amm';

export const store = configureStore({
    reducer: {
        provider,
        tokens,
        amm
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});
