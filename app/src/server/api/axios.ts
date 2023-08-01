import Axios from 'axios';

export const commonRequest = Axios.create({
    baseURL: 'http://localhost:3000/',
    timeout: 8000,
});
