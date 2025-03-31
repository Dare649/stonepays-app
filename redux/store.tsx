import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from '@/redux/slice/auth/authSlice';
import loadingReducer from '@/redux/slice/loadingSlice';
import productReducer from "@/redux/slice/product/productSlice";
import orderReducer from "@/redux/slice/order/orderSlice"
import paymentReducer from "@/redux/slice/payment/paymentSlice";

const persistConfig = {
    key: 'root',
    storage,
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);
const persistedProductReducer = persistReducer(persistConfig, productReducer);
const persistedOrderReducer = persistReducer(persistConfig, orderReducer);
const persistedPaymentReducer = persistReducer(persistConfig, paymentReducer);

export const store = configureStore({
    reducer: {
        loading: loadingReducer,
        auth: persistedAuthReducer,
        product: persistedProductReducer,
        order: persistedOrderReducer,
        payment: persistedPaymentReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
            },
        }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
