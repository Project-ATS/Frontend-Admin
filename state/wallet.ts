import { combineReducers } from 'redux'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import * as actions from './actionType'

const persistConfig = {
  key: 'root',
  storage,
}

const initialWalletState = {
  user: {
    address: '',
  },
}

const connectWalletReducer = (config = initialWalletState, action:any) => {
  switch (action.type) {
    case actions.CONNECT_WALLET:
      return {
        ...config,
        user: action.user,
      }
    case actions.DISCONNECT_WALLET:
      storage.removeItem('persist:root')
      return {
        ...initialWalletState,
      }
    case actions.TEZOS_INSTANCE:
      return { ...config }
    case actions.CONNECT_WALLET_ERROR:
      return config
    default:
      return config
  }
}


const reducers = combineReducers({
  walletConfig: connectWalletReducer,
})

const persistedReducer = persistReducer(persistConfig, reducers)
export default persistedReducer
