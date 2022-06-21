import { Link } from 'react-router-dom';
import classes from './authorInfoMenu.module.css';


const AuthorInfoMenu = ({isMenuActive, toggleIsMenuActive}) => {
    let author_uuid = new URLSearchParams(window.location.search).get('author_uuid');

    const onProfileClicked = () => {
        if (isMenuActive)
            toggleIsMenuActive();
    }

    return (
        <div className={[classes.author__info_menu, isMenuActive ? classes.active : ""].join(" ")}>
            <div className={classes.author__info_menu_inner}>
                <Link to={"/author/?author_uuid=" + author_uuid}>
                    <p className={classes.author__info_menu_back}>
                        {"<"} Back
                    </p>
                </Link>
                <button className={[classes.author__info_menu_item, classes.active].join(" ")}
                    onClick={onProfileClicked}>
                    <p className={classes.author__info_menu_item_title}>
                        Profile
                    </p>
                </button>
                <button className={classes.author__info_menu_item}>
                    <p className={classes.author__info_menu_item_title}>
                        Help 
                    </p>
                </button>
            </div>
        </div>
    );
};

export default AuthorInfoMenu;
