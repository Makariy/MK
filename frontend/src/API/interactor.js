import axios from "axios";
import { checkResponseError, resizeImage } from "./utils";




export const addLikeOnPostOnServer = (post_uuid) => {
    let data = new FormData();
    data.append("post_uuid", post_uuid)

    return axios({
        url: "/api/posts/add_like/", 
        method: "POST",
        data: data,
        headers: {
            'Content-Type' : 'application/json; charset=UTF-8',
        }
    }).then(response => response.data).then(checkResponseError);
}

export const removeLikeOnPostOnServer = (post_uuid) => {
    let data = new FormData();
    data.append("post_uuid", post_uuid)
    
    return axios({
        url: "/api/posts/remove_like/", 
        method: "POST",
        data: data, 
        headers: {
            'Content-Type' : 'application/json; charset=UTF-8',
        }
    }).then(response => response.data).then(checkResponseError);
}


export const postNewPostOnServer = ({title, text, files}) => {
    const post_data = new FormData();
    post_data.append('title', title);
    post_data.append('text', text);
    if (files) {
        let file = files.length == 1 ? files[0] : null
        if (file) {
            const file_data = window.URL.createObjectURL(file);
            return resizeImage(file_data, 450).then(blob => {
                blob.name = file.name;
                post_data.append('file', blob)
                return axios({
                    url: "/api/posts/create/post/",
                    method: 'POST',
                    data: post_data 
                }).then(response => response.data).then(checkResponseError)           
            })
        }
    }

    return axios({
        url: "/api/posts/create/post/",
        method: 'POST',
        data: post_data 
    }).then(response => response.data).then(checkResponseError)
}

export const deletePostOnServer = (post_uuid) => {
    const post_data = new FormData();
    post_data.append('post_uuid', post_uuid);

    return axios({
        url: "/api/posts/delete/post/",
        method: 'POST',
        data: post_data
    }).then(response => response.data).then(checkResponseError)
}


export const redactPostOnServer = ({post_uuid, title, text, files, hadChangedFile}) => {

    const post_data = new FormData();
    post_data.append('post_uuid', post_uuid);
    post_data.append('title', title);
    post_data.append('text', text);
    post_data.append('had_changed_file', hadChangedFile)

    if (files) {
        let file = files.length == 1 ? files[0] : null
        if (file) {
            const file_data = window.URL.createObjectURL(file);
            return resizeImage(file_data, 450).then(blob => {
                blob.name = file.name;
                post_data.append('file', blob)
                return axios({
                    url: '/api/posts/redact/post/',
                    method: 'POST',
                    data: post_data
                }).then(response => response.data).then(checkResponseError)                
            })
        }
    }

    return axios({
        url: '/api/posts/redact/post/',
        method: 'POST',
        data: post_data
    }).then(response => response.data).then(checkResponseError)
}
