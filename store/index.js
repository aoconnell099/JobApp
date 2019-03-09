import { createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { persistStore, persistCombineReducers } from 'redux-persist';
import { AsyncStorage } from 'react-native';
import reducers from '../reducers';

// const store = createStore(
//     reducers,
//     {},
//     compose(
//         applyMiddleware(thunk),
//         autoRehydrate()
//     )
// );
const config = {
    key: 'root',
    storage: AsyncStorage,
    whitelist: ['likedJobs']
   };
   const reducer = persistCombineReducers(config, reducers);
   export default function configurationStore(initialState = {}) {
   const store = createStore(
     reducer,
     initialState,
     applyMiddleware(thunk),
   );
   const persistor = persistStore(store); // -.purge() is deprecated- Add .purge() if you want to clear the persisted store for testing
    return { persistor, store };
   }

//export default store;