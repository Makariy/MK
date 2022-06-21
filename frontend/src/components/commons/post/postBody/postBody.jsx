import classes from './postBody.module.css';


const PostBody = ({post}) => {
    return (
        <div className={classes.post__body}>
            {
                post.image_url ? 
                    <img src={post.image_url} className={classes.post__body_img}/>
                        :
                    ""
            }
            <h4 className={classes.post__body_title}>
                {post.title}
            </h4>
            <p className={classes.post__body_text}>
                {post.text}
            </p>
        </div>
    );
}

export default PostBody;
