import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from '@/redux/slice/auth/authSlice';
import loadingReducer from '@/redux/slice/loadingSlice';
import productReducer from "@/redux/slice/product/productSlice";
import orderReducer from "@/redux/slice/order/orderSlice"
import paymentReducer from "@/redux/slice/payment/paymentSlice";
import categoryReducer from "@/redux/slice/category/categorySlice";
import cartReducer from "@/redux/slice/cart/cartSlice";

const persistConfig = {
    key: 'root',
    storage,
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);
const persistedProductReducer = persistReducer(persistConfig, productReducer);
const persistedOrderReducer = persistReducer(persistConfig, orderReducer);
const persistedPaymentReducer = persistReducer(persistConfig, paymentReducer);
const persistedCategoryReducer = persistReducer(persistConfig, categoryReducer);
const persistedCartReducer = persistReducer(persistConfig, cartReducer);

export const store = configureStore({
    reducer: {
        loading: loadingReducer,
        auth: persistedAuthReducer,
        product: persistedProductReducer,
        order: persistedOrderReducer,
        payment: persistedPaymentReducer,
        category: persistedCategoryReducer,
        cart: persistedCartReducer,
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
