import {
    FETCH_JOBS
} from '../actions/types';

const INITIAL_STATE = {
    searchedJob: '',
    results: [],
    region: {
        latitude: 41.8781,
        longitude: -87.6298,
        latitudeDelta: 0.045,
        longitudeDelta: 0.02
    }
};

export default function(state = INITIAL_STATE, action) {
    switch (action.type) {
        case FETCH_JOBS: // ...state is probably unneccessary
            return { ...state, results: action.payload.data, region: action.payload.region};
        default:
            return state;
    }
}