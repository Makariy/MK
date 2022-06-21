import axios from "axios";
import { checkResponseError } from "./utils";


export const fetchAuthorPosts = ({author_uuid, search_by, search_query}) => {
    let url_params = new URLSearchParams({
        author_uuid: author_uuid,
        search_by: search_by,
        query: search_query 
    })
    return axios("/api/posts/get/posts/?" + url_params.toString())
        .then(response => response.data).then(checkResponseError)
}

export const fetchAuthors = ({search_query}) => {
    let url_params = new URLSearchParams({
        name: search_query
    })
    return axios("/api/user/get/authors/?" + url_params.toString())
        .then(response => response.data).then(checkResponseError)
}

export const fetchAuthor = (author_uuid) => {
    let url_params = new URLSearchParams({
        author_uuid: author_uuid
    })
    return axios("/api/user/get/author/?" + url_params.toString())
        .then(response => response.data).then(checkResponseError)
}
