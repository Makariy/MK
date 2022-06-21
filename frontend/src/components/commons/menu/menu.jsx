import React, { useContext } from "react";
import AuthContext from "../../../context/auth";
import classes from './menu.module.css';
import { Link } from "react-router-dom";
import { authOnServer, deauthOnServer } from "../../../API/authorizer";


const Menu = () => {
    const {user, setUser} = useContext(AuthContext);

    const authExit = () => {
        deauthOnServer().then(response => {
            setUser(null);
            localStorage.setItem('auth', null);
        }).catch(exception => {
            setUser(null);
            localStorage.setItem('auth', null);
        })
    }

    return (
        <section className={classes.menu}>
            <div className="container">
                <div className={classes.menu__inner}>
                    <div className={classes.logo}>
                        <Link to="/">
                            Untitled
                        </Link>
                    </div>
                    <div className={classes.profile}>
                        {
                            user == null ? 
                                <div className={classes.profile__login}>
                                    <Link to={"/login/?next=" + (window.location.pathname + window.location.search)} 
                                        className={classes.profile__login_text}>
                                        Login
                                    </Link>
                                </div>
                                        :
                                <div className={classes.profile__profile}>
                                    <a href="#" className={classes.profile__profile_inner}>
                                        <p className={classes.profile__profile_inner_text}>
                                            {user.username}
                                        </p>
                                        {
                                            user.profile_image ?
                                                <img src={user.profile_image} className={classes.profile__profile_inner_img}/>
                                                    :
                                                <div style={{backgroundColor: "#fff"}} className={classes.profile__profile_inner_img}></div>
                                        }
                                    </a>
                                    <button onClick={authExit} className={classes.profile__profile_inner_exit}>
                                        <img src={"/static/exit.svg"} className={classes.profile__profile__inner_exit_img}/>
                                    </button>
                                </div>
                        }
                    </div>

                </div>
            </div>
        </section>
    );
};

export default Menu;
