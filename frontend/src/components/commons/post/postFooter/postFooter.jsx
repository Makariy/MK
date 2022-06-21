import Like from '../like/like';
import classes from './postFooter.module.css';


const PostFooter = ({post, toggleLike, isLiked}) => {
    
    return (
        <div className={classes.post__footer}>
            <div className={classes.post__footer_likes}>
                <Like toggleLike={toggleLike} isLiked={isLiked}/>
                <p className={classes.post__footer_likes_counter}>
                    {post.likes}
                </p>
            </div>
        </div>
    );
}
export default PostFooter;
