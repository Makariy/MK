import React, { useContext, useState } from "react";
import classes from './search.module.css';
import SearchInput from "./searchInput/searchInput";


const Search = ({...params}) => {
    return (
        <section className={classes.search}>
            <div className={classes.search__inner}>
                <div className={classes.search__inner_search}>
                    <SearchInput {...params}/>
                </div>
            </div>
        </section>
    );
};

export default Search;
