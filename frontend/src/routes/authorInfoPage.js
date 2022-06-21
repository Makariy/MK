import React, { useEffect, useState } from "react";
import Menu from '../components/commons/menu/menu';
import AuthorInfo from "../components/UI/authorInfo/authorInfo";
import AuthContext from "../context/auth";
import { fetchAuthor } from "../API/fetcher";
import Loader from "../components/commons/loader/loader";


const AuthorInfoPage = () => {

    const [author, setAuthor] = useState(null);
    let author_uuid = new URLSearchParams(window.location.search).get('author_uuid');

    useEffect(
        () => {
            fetchAuthor(author_uuid).then(response => {
                setAuthor(response.user)
            })
        },
        []
    )

    return (
        <React.Fragment>
            <Menu />
            {
                author ? 
                    <AuthorInfo author={author}/>
                        :
                    <Loader />
            }
        </React.Fragment>
    );
};

export default AuthorInfoPage;
