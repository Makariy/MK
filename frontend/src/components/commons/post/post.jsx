import React, { useContext, useState } from "react";

import classes from "./post.module.css";
import PostHeader from "./postHeader/postHeader";
import PostBody from "./postBody/postBody";

import AuthContext from "../../../context/auth";
import { addLikeOnPostOnServer, deletePostOnServer, removeLikeOnPostOnServer } from "../../../API/interactor";
import PostFooter from "./postFooter/postFooter";


const Post = ({post, setPost, redactPost}) => {
    const isLiked = post.is_liked;

    const setLikes = (count, is_liked) => {
        let new_post = {...post};
        new_post.likes = count;
        new_post.is_liked = is_liked;
        setPost(new_post);
    }

    const toggleLike = () => {
        if (isLiked) {
            removeLikeOnPostOnServer(post.uuid).then(response => {
                response.action == 'LIKE_REMOVED' ? 
                    setLikes(response.likes_count, false) 
                        : 
                    setLikes(response.likes_count, true);
            }).catch(err => {
                console.log(err)
            });
        }
        else {
            addLikeOnPostOnServer(post.uuid).then(response => {
                response.action == 'LIKE_ADDED' ? 
                    setLikes(response.likes_count, true) 
                        : 
                    setLikes(response.likes_count, false);

            }).catch(err => {
                console.log(err)
            });
        }
    }

    const deletePost = () => {
        deletePostOnServer(post.uuid).then(response => {
            setPost(null);
        })
    }

    return (
        <div className={classes.post}>
            <PostHeader 
                post={post}
                author={post.author}
                date={post.date}
                deletePost={deletePost} 
                redactPost={redactPost}
            /> 
            <PostBody post={post} />
            <PostFooter post={post} toggleLike={toggleLike} isLiked={isLiked}/>
        </div>
    );
};

export default Post;
