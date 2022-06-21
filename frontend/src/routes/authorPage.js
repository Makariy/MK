import React, { useEffect, useState } from 'react';

import Menu from '../components/commons/menu/menu';
import Posts from '../components/UI/posts/posts';
import AuthorCard from '../components/UI/authorCard/authorCard';
import PostsContext from '../context/posts';
import CreatingContext from '../context/creating';
import { fetchAuthor } from '../API/fetcher';
import Loader from '../components/commons/loader/loader';



const AuthorPage = () => {

    const [author, setAuthor] = useState(null)

    let author_uuid = new URLSearchParams(window.location.search).get('author_uuid')

    useEffect(() => {
        fetchAuthor(author_uuid).then(response => {
            setAuthor(response.user);
        })
    }, [])

    const [posts, setPosts] = useState(null)
    const [isLoading, setIsLoading] = useState(false);
    const [postMoreActive, setPostMoreActive] = useState(null);
    const [searchQuery, setSearchQuery] = useState({
        search_query: "",
        search_by: "title",
        author_uuid: author_uuid,
    })

    const [creatingPost, setCreatingPost] = useState({
        title: '',
        text: '',
        files: null
    })
    const [isCreating, setIsCreating] = useState(false);
    const [isRedacting, setIsRedacting] = useState(false);

    return (
        <React.Fragment>
            <Menu />
            <PostsContext.Provider value={{
                author: author,
           
                posts: posts,
                setPosts: setPosts,
           
                isLoading: isLoading,
                setIsLoading: setIsLoading,
           
                searchQuery: searchQuery,
                setSearchQuery: setSearchQuery,

                postMoreActive: postMoreActive,
                setPostMoreActive: setPostMoreActive,
           }}>
                <CreatingContext.Provider value={{
                    creatingPost: creatingPost,
                    setCreatingPost: setCreatingPost,
                    
                    isCreating: isCreating,
                    setIsCreating: setIsCreating,
                
                    isRedacting: isRedacting,
                    setIsRedacting: setIsRedacting,
                }}>

                    <div className="container">
                        <div className="author_layout">
                            {
                                !author ? <Loader />
                                    :
                                <React.Fragment>
                                    <Posts /> 
                                    <AuthorCard author={author} />
                                </React.Fragment>   
                            }
                        </div>
                    </div>
                    </CreatingContext.Provider>
            </PostsContext.Provider>
        </React.Fragment>
    );
};

export default AuthorPage;