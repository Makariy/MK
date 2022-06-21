import classes from './authorInfoCard.module.css';

const AuthorInfoCard = ({author}) => {
    return (
        <div className={classes.author__info_info_card}>
            {
                author.profile_image ? 
                    <img src={author.profile_image} className={classes.author__info_info_card_img}/>
                        :
                    <div style={{backgroundColor: "#fff"}} className={classes.author__info_info_card_img}></div>
            }
            <div className={classes.author__info_info_card_text}>
                <p className={classes.author__info_info_card_text_username}>
                    {author.username}
                </p>
                <p className={classes.author__info_info_card_text_uuid}>
                    {author.uuid}
                </p>
            </div>
        </div>
    );
}

export default AuthorInfoCard;

