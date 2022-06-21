import axios from "axios";
import { checkResponseError } from "./utils";


export const authOnServer = (username, password) => {
    let data = new FormData();
    data.append('username', username);
    data.append('password', password);

    return axios({
        url: "/api/auth/login/",
        method: "POST",
        data: data
    }).then(response => response.data).then(checkResponseError);
};
 
export const deauthOnServer = () => {
    return axios({
        url: "/api/auth/logout/",
        method: "POST"
    }).then(response => response.data).then(checkResponseError);
}


export const registerOnServer = (username, password, email) => {
    let data = new FormData();
    data.append('username', username);
    data.append('password', password);
    data.append('email', email);

    return axios({
        url: "/api/auth/register/",
        method: "POST",
        data: data
    }).then(response => response.data).then(checkResponseError);
}
