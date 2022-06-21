import classes from './like.module.css';

import { useContext } from 'react';
import AuthContext from '../../../../context/auth';

const Like = ({isLiked, toggleLike}) => {
    const {user} = useContext(AuthContext);

    return (
        <button onClick={toggleLike} data-is-active={isLiked} className={classes.post__footer_likes_button}>
            {
                user != null && isLiked ?
                    <img src={"/static/active_heart.svg"} className={classes.post__footer_likes_button_img}/>
                        :
                    <img src={"/static/heart.svg"} className={classes.post__footer_likes_button_img}/>
            }
        </button>
    );
}

export default Like 
