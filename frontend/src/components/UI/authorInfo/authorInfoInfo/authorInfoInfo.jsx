import AuthorInfoCard from '../authorInfoCard/authorInfoCard';
import AuthorInfoDescription from '../authorInfoDescription/authorInfoDescription';
import classes from './authorInfoInfo.module.css';


const AuthorInfoInfo = ({author, toggleIsMenuActive}) => {
    
    return (
        <div className={classes.author__info_info}>
            <button onClick={toggleIsMenuActive} className={classes.author__info_info_menu}>
                <img src={"/static/menu.svg"}/>
                <span>
                    More
                </span>
            </button>
            <AuthorInfoCard author={author}/>
            <AuthorInfoDescription author={author}/>
        </div>
    );
}

export default AuthorInfoInfo;
