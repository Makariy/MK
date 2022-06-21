import React from "react";
import classes from "./authorCard.module.css";
import { Link } from 'react-router-dom'


const AuthorCard = ({author}) => {

    return (
        <div className={classes.author_card}>
            <div className={classes.author_card_author}>
                <Link to={"info/?author_uuid=" + author.uuid} replace>
                    {
                        author.profile_image ? 
                            <img src={author.profile_image} className={classes.author_card_author_img}/>
                                :
                            <div style={{backgroundColor: "#fff"}} className={classes.author_card_author_img}></div>
                    }
                </Link>
                <div className={classes.author_card_author_text}>
                    <h3 className={classes.author_card_author_name}>
                        {author.username}
                    </h3>
                    <div className={classes.author_card_author_mobile}>
                        <button className={classes.author_card_author_mobile_button}>
                            <span className={classes.author_card_author_mobile_button_text}>
                                Follow
                            </span>
                        </button>
                        <button className={classes.author_card_author_mobile_more}>
                            <img src={"/static/arrow.svg"} alt="v"/>
                        </button>
                    </div>
                </div>
            </div>
            <div className={classes.author_card_data}>
                <div className={classes.author_card_data_item}>
                    <p className={classes.author_card_data_item_text}>
                        Followers:
                    </p>
                    <p className={classes.author_card_data_item_text_count}>
                        {"1000k"}
                    </p>
                    <p className={classes.author_card_data_item_text}>
                        Likes:
                    </p>
                    <p className={classes.author_card_data_item_text_count}>
                        {"1337k"}
                    </p>
                </div>
            </div>
            <div className={classes.author_card_footer}>
                <button className={classes.author_card_footer_button}>
                    <span className={classes.author_card_footer_button_text}>
                        Follow
                    </span>
                </button>
            </div>
        </div>
    )
};

export default AuthorCard;
