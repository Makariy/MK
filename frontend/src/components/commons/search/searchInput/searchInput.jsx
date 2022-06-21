import React from "react";
import classes from './searchInput.module.css';

import Input from "../../UI/input/input";


const SearchInput = ({
    placeholder,
    setIsLoading, 
    searchQuery, setSearchQuery,
    onSearchClicked,
    onFiltersButtonClicked,
}) => {

    const onSearchButtonClicked = (e) => {
        e.preventDefault();

        setIsLoading(true);
        
        onSearchClicked(searchQuery).then(() => {
            setIsLoading(false)
        }).catch(error => {
            console.log("Error fetching posts from server: ", error)
        })
    }

    const onSearchQueryInput = (e) => {
        let current_query = {...searchQuery};
        current_query.search_query = e.target.value;

        setSearchQuery(current_query)
    }

    return (
        <form className={classes.search__form}>
            <Input onInput={onSearchQueryInput} placeholder={placeholder}/>
            <input 
                value="Search"
                type="submit" 
                className={classes.search__button} 
                onClick={onSearchButtonClicked}    
            />
            <button onClick={onSearchButtonClicked} className={classes.search__button_mobile}>
                <img src={"/static/loop.svg"} alt="Q" className={classes.search__button_mobile_img}/>
            </button>

            {
                onFiltersButtonClicked ? 
                    <button onClick={onFiltersButtonClicked}>
                        <img className={classes.search__filters} alt="v" src="/static/arrow.svg"/>
                    </button>
                        :
                    ""   
            }
        </form>
    );
}

export default SearchInput;
