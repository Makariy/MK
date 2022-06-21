import React, { useState } from "react";
import classes from './authorInfo.module.css';
import AuthorInfoInfo from "./authorInfoInfo/authorInfoInfo";
import AuthorInfoMenu from "./authorInfoMenu/authorInfoMenu";


const AuthorInfo = ({author}) => {
    const [isMenuActive, setIsMenuActive] = useState(false);

    const toggleIsMenuActive = () => setIsMenuActive(!isMenuActive);

    return (
        <section className={classes.author_section}>
            <div className="container">

                <div className={classes.author}>

                    <AuthorInfoMenu toggleIsMenuActive={toggleIsMenuActive} isMenuActive={isMenuActive}/>
                    <AuthorInfoInfo author={author} toggleIsMenuActive={toggleIsMenuActive}/>

                </div>  

            </div>
        </section>
    );
};

export default AuthorInfo;
