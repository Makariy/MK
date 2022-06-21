import React, { useContext, useState } from "react";
import classes from './postSearch.module.css';

import SearchInput from "../../commons/search/searchInput/searchInput";
import PostSearchCreation from "./postSearchCreation/postSearchCreation";
import PostSearchFilters from "./postSearchFilters/postSearchFilters";
import CreatingContext from "../../../context/creating";
import PostsContext from "../../../context/posts";
import { fetchAuthorPosts } from "../../../API/fetcher";


const PostSearch = ({withCreation}) => {
    const {
        isCreating, setIsCreating, 
        isRedacting, setIsRedacting, 
        setCreatingPost
    } = useContext(CreatingContext);

    const {
        searchQuery, setSearchQuery,
        setIsLoading,
        setPosts
    } = useContext(PostsContext);

    const [isFilterActive, setIsFilterActive] = useState(false);
    

    const toggleIsCreating = () => {
        setIsCreating(!isCreating)
        if (isRedacting)
            setCreatingPost({
                title: "",
                text: "",
                files: null 
            })
        setIsRedacting(false);
    }
    
    const onFiltersButtonClicked = (e) => {
        e.preventDefault();
        setIsFilterActive(!isFilterActive)
    }

    const onSearchButtonClicked = (query) => {
        return fetchAuthorPosts(query).then(
            response => setPosts(response.posts)
        )
    }

    return (
        <section className={classes.search}>
            <div className={classes.search__inner}>
                <div className={classes.search__inner_search}>
                    <SearchInput 
                        placeholder={"Search for publication..."}
                        onSearchClicked={onSearchButtonClicked}
                        setIsLoading={setIsLoading}
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        onFiltersButtonClicked={onFiltersButtonClicked}
                    />
                    <PostSearchCreation 
                        toggleIsCreating={toggleIsCreating} 
                        isCreating={isCreating} 
                        onFiltersButtonClick={onFiltersButtonClicked}
                        withCreation={withCreation}
                    />
                </div>
                <PostSearchFilters isFilterActive={isFilterActive}/>
            </div>
        </section>
    );
};

export default PostSearch;
