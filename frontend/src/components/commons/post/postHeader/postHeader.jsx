import React, { useContext, useState } from 'react';
import classes from './postHeader.module.css';
import AuthContext from '../../../../context/auth';
import PostsContext from '../../../../context/posts';
import CreatingContext from '../../../../context/creating';


const PostHeader = ({post, author, date, deletePost, redactPost}) => {

    const {user} = useContext(AuthContext)

    const {postMoreActive, setPostMoreActive} = useContext(PostsContext)
    const {setCreatingPost, setIsCreating, setIsRedacting} = useContext(CreatingContext);

    const onMoreClicked = () => {
        if (postMoreActive != post.uuid)
            setPostMoreActive(post.uuid)
        else 
            setPostMoreActive(null)
    }

    const onDeletePostClicked = () => {
        deletePost();
    }

    const onRedactPostClicked = () => {
        setPostMoreActive(null)
        setIsCreating(true)
        setIsRedacting(true)
        setCreatingPost(post)
        window.scrollTo({top: 100, behavior: 'smooth'})
    }

    return (
        <div className={classes.post__header}>
            <div className={classes.post__header_author}>
                {
                    author.profile_image ? 
                        <img src={author.profile_image} className={classes.post__header_author_img}/>
                            :
                        <div style={{backgroundColor: "#fff"}} className={classes.post__header_author_img}></div>
                }
                <div className={classes.post__header_author_text}>
                    <h4 className={classes.post__header_author_text_username}>
                        {author.username}
                    </h4>
                    <p className={classes.post__header_author_text_date}>
                        {date.substr(0, 10)}
                    </p>
                </div>
            </div>
            <div className={classes.post__header_more}>
                <button onClick={() => post != null ? onMoreClicked() : ""} className={classes.post__header_more_button}>
                    <img src={"/static/more.svg"}/>
                </button>
                {
                    post != null ?
                    <div className={[classes.post__header_more__more, postMoreActive == post?.uuid && post ? classes.active : ""].join(" ")}>
                        {
                            user && user.uuid == author.uuid ?
                            <div className={classes.post__header_more__more_item}>
                                <button className={classes.post__header_more__more_text} onClick={onDeletePostClicked}>
                                    Delete
                                </button>
                                <button className={classes.post__header_more__more_text} onClick={onRedactPostClicked}>
                                    Redact
                                </button>
                            </div>
                                :
                            ""
                        }
                    </div>
                        :
                    ""
                }
                
            </div>
        </div>
    );
}

export default PostHeader; 