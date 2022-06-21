import React, { useState, useEffect, useContext } from "react";
import PostSearch from "../../UI/postSearch/postSearch";
import PostCreator from "../postCreator/postCreator";
import Post from "../../commons/post/post";
import Loader from '../../../components/commons/loader/loader';

import { fetchAuthorPosts } from '../../../API/fetcher';
import AuthContext from "../../../context/auth";
import PostsContext from "../../../context/posts";
import CreatingContext from "../../../context/creating";


const Posts = () => {

    const {author, posts, setPosts} = useContext(PostsContext);
    const {isLoading, setIsLoading} = useContext(PostsContext);
    const {user} = useContext(AuthContext);

    const {isCreating} = useContext(CreatingContext);

    useEffect(() => {
        setIsLoading(true);
        fetchAuthorPosts({
            author_uuid: author.uuid
        })
            .then(data => setPosts(data.posts))
            .then(data => {
                setIsLoading(false);
                return data;
            })
            .catch(error => {
                setIsLoading(false);
                console.log("Error fetching posts from server")
            })
    }, [author, setIsLoading, setPosts]);


    const setPost = (post_uuid, new_post) => {
        let new_posts = [...posts];
        if(new_post == null) {
            new_posts = new_posts.filter(item => item.post.uuid != post_uuid);
        }
        else {
            new_posts = new_posts.map((item) => {
                if (item.post.uuid === post_uuid) 
                    return {
                        post: new_post
                    }
                else
                    return item
            });
        }
        setPosts(new_posts)
    }

    const createPost = (new_post) => {
        setPosts([{
                post: new_post
            },
            ...posts]);
    }
    
    return (
        <div style={{marginBottom: "100px"}}>
            <PostSearch 
                withCreation={user?.uuid === author.uuid ? true : false} 
                style={{display: !isCreating ? "none" : "block"}}
            />
            {
                user != null ?
                    <PostCreator 
                        author={author}
                        date={"Now"}
                        createPost={createPost} 
                        setPost={setPost}
                    />
                    :
                    ""
            }
            {
                (isLoading || !posts) ? <Loader /> : posts.map(item => 
                    <Post 
                        key={item.post.uuid} 
                        post={item.post} 
                        setPost={(new_post) => setPost(item.post.uuid, new_post)}
                        />
                    )
            }
        </div>
    )
};


export default Posts;