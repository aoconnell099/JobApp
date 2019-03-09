import axios from 'axios';
import reverseGeocode from 'latlng-to-zip';
import qs from 'qs';
import { Location } from 'expo';

import {
    FETCH_JOBS,
    LIKE_JOB,
    CLEAR_LIKED_JOBS
} from './types';

import JOB_DATA from '../IndeedJobData.json';

const JOB_ROOT_URL = 'http://api.indeed.com/ads/apisearch?';
const JOB_QUERY_PARAMS = {
    publisher: '4201738803816157',
    format: 'json',
    v: '2',
    latlong: 1,
    radius: 10,
    q: 'javascript'
}

const GITHUB_JOB_ROOT_URL = 'https://jobs.github.com/positions.json?';
const GITHUB_JOB_QUERY_PARAMS = {
    //description: 'javascript',
    markdown: true
}
                            
const buildGitJobsUrl = (zip, description) => {
    const query = qs.stringify({ ...GITHUB_JOB_QUERY_PARAMS, description, location: zip });
    return `${GITHUB_JOB_ROOT_URL}${query}`;
};

const buildJobsUrl = (zip) => {
    const query = qs.stringify({ ...JOB_QUERY_PARAMS, l: zip });
    return `${JOB_ROOT_URL}${query}`;
};

export const fetchJobs = (region, searchedJob, callback) => async (dispatch) => { // Same destucturing as in auth_actions. *Used often when making asynchronous promises and fetch request using axios or react native fetch
    try {
        //Location.setApiKey('AIzaSyBVhRhSnPF-TA1dCeeFl4WDnCTDn7xDQzc');
        let [{ postalCode }] = await Location.reverseGeocodeAsync(region); // reverseGeocodeAsync returns an array containing an object with city, country, street, postal code, etc. Destructure the postal code to use instead of returnedArray[0].postalCode
        console.log(searchedJob);
        const url = buildJobsUrl(postalCode);
        const gitUrl = buildGitJobsUrl(postalCode, searchedJob);
        console.log(gitUrl);
        let { data } = await axios.get(gitUrl); // Indeed Api publisher key doesn't work so workaround is copying sample data into IndeedJobData.json and sending it as th payload
        dispatch({ type: FETCH_JOBS, payload: { data, region }}); // Should be data
        callback();
    } catch(e) {
        console.log('error');
        console.error(e);
    }
};

export const likeJob = (job) => {
    return {
        payload: job,
        type: LIKE_JOB
    };
};

export const clearLikedJobs = () => {
    return { type: CLEAR_LIKED_JOBS };
};