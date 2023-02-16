import { configureStore } from '@reduxjs/toolkit'

import basketReducer from './basket'
import persistedReducer from './wallet'

const store = configureStore({
    reducer: {
        basket: basketReducer,
        account: persistedReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ serializableCheck: false }),
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

export default store
