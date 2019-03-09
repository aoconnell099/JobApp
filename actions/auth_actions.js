import { AsyncStorage } from 'react-native';
import { Facebook } from 'expo';
import {
    FACEBOOK_LOGIN_SUCCESS,
    FACEBOOK_LOGIN_FAIL
} from './types';



export const facebookLogin = () => async dispatch => { // Returning a single statement allows for removal of curly braces after first arrow. Single parameter of dispatch allows for removal of parens
    let token= await AsyncStorage.getItem('fb_token');

    if (token) { // If user is already logged in
        // Dispatch an action saying FB login is done
        dispatch({ type: FACEBOOK_LOGIN_SUCCESS, payload: token });
    } else {
        // Start of Fb login
        doFacebookLogin(dispatch); // function needs dispatch for login fail dispatch
    }
};

const doFacebookLogin = async dispatch => {
    let { type, token } = await Facebook.logInWithReadPermissionsAsync('860508087674011',{ // Destructure type and token from result
        permissions: ['public_profile']
    });

    if (type === 'cancel') {
        return dispatch({ type: FACEBOOK_LOGIN_FAIL });
    }

    await AsyncStorage.setItem('fb_token', token); // Wait for token to be saved, then dispatch
    dispatch({ type: FACEBOOK_LOGIN_SUCCESS, payload: token });
};