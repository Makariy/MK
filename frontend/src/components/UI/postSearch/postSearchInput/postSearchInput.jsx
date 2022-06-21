import React, {useContext} from "react";
import classes from './postSearchInput.module.css';

import Input from "../../../commons/UI/input/input";
import { fetchAuthorPosts } from "../../../../API/fetcher";

import PostsContext from "../../../../context/posts";



const PostSearchInput = ({onFiltersButtonClick}) => {

    const {setIsLoading, setPosts} = useContext(PostsContext);
    const {searchQuery, setSearchQuery} = useContext(PostsContext);

    const fetchPostsByQuery = (e) => {
        e.preventDefault();

        setIsLoading(true);
        
        fetchAuthorPosts(searchQuery).then(data => {
            setPosts(data.posts);
            setIsLoading(false)
        })
        .catch(error => {
            console.log("Error fetching posts from server")
        })
    }

    const onSearchQueryInput = (e) => {
        let current_query = {...searchQuery};
        current_query.search_query = e.target.value;

        setSearchQuery(current_query)
    }

    return (
        <form className={classes.search__form}>
            <Input onInput={onSearchQueryInput} placeholder="Search for publication..."/>
            <input 
                value="Search"
                type="submit" 
                className={classes.search__button} 
                onClick={fetchPostsByQuery}
            />
            <button onClick={fetchPostsByQuery} className={classes.search__button_mobile}>
                <img src={"/static/loop.svg"} alt="Q" className={classes.search__button_mobile_img}/>
            </button>


            <button onClick={onFiltersButtonClick}>
                <img className={classes.search__filters} alt="v" src="/static/arrow.svg"/>
            </button>
            
        </form>
    );
}

export default PostSearchInput;
