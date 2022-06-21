import classes from './authorInfoDescription.module.css';


const AuthorInfoDescription = ({author}) => {

    return (
        <div className={classes.author__info_description}>
            <div className={classes.author__info_description_info}>
                <h4 className={classes.author__info_description_item_title}>
                    Username:
                </h4>
                <p className={[classes.author__info_description_item_text,
                               classes.author__info_description_item_username].join(" ")}>
                    {author.username}
                </p>
            </div>
            <div className={classes.author__info_description_info}>
                <h4 className={classes.author__info_description_item_title}>
                    Email:
                </h4>
                <p className={classes.author__info_description_item_text}>
                    {
                        author.email ? author.email
                               :
                            "Author had not opened his email for public."
                    } 
                </p>
            </div>
            <div className={classes.author__info_description_item}>
                <h4 className={classes.author__info_description_item_title}>
                    Bio:
                </h4>
                <p className={classes.author__info_description_item_bio}>
                    {
                        author.bio ? 
                            author.bio
                                :
                            "There is no biografy specified..."
                    }
                </p>
            </div>
            <div className={classes.author__info_description_info}>
                <h4 className={classes.author__info_description_item_title}>
                    Tron: 
                </h4>
                <p className={classes.author__info_description_item_text}>
                    TVKiKtap5LwTQsej5RywvhYqNQpzPQ25Gc
                </p>
            </div>
            <div className={classes.author__info_description_info}>
                <h4 className={classes.author__info_description_item_title}>
                    Tether (ERC-20):
                </h4>
                <p className={classes.author__info_description_item_text}>
                    0x7f4D4B04bb44962ed28ad4e63405D86E4884c45C
                </p>
            </div>
            <div className={classes.author__info_description_info}>
                <h4 className={classes.author__info_description_item_title}>
                    Ethereum:
                </h4>
                <p className={classes.author__info_description_item_text}>
                    0x7f4D4B04bb44962ed28ad4e63405D86E4884c45C
                </p>
            </div>
        </div>
    );
}

export default AuthorInfoDescription;
