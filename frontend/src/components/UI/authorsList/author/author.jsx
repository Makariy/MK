import React from "react";
import classes from "./author.module.css"
import { Link } from "react-router-dom";


const Author = ({author}) => {

    let bio_truncated = "";
    if (author.bio) {
        bio_truncated = author.bio.substr(0, 150);
        if (bio_truncated.length < author.bio.length) 
            bio_truncated += "...";    
    }
    
    return (
        <Link to={"/author/?author_uuid=" + author.uuid} className={classes.author}>
            <div className={classes.author__inner}>
                <div className={classes.author__image}>
                    {
                        author.profile_image ? 
                            <img src={author.profile_image} className={classes.author__image_image}/>
                                :
                            <div style={{backgroundColor: "#fff"}} className={classes.author__image_image}></div>
                    }
                </div>
                <div className={classes.author__text}>
                    <h4 className={classes.author__text_name}>
                        {author.username}
                    </h4>
                    <p className={classes.author__text_bio}>
                        {
                            bio_truncated ? 
                                bio_truncated
                                    :
                                "The author had not specified his biografy."
                        }
                    </p>
                </div>
                <div className={classes.author__footer}>
                    <button onClick={() => alert("Not implemented")} className={classes.author__footer_more}>
                        <img src={"/static/more.svg"}/>
                    </button>
                    <button onClick={() => alert("Not implemented")} className={classes.author__footer_follow}>
                        Follow 
                    </button>
                </div>
            </div>
        </Link>
    )
}

export default Author;
