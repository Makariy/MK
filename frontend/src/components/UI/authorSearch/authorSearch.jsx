import React, { useContext } from "react";
import { fetchAuthors } from "../../../API/fetcher";
import AuthorSearchContext from "../../../context/authorSearch";
import Search from "../../commons/search/search";
import classes from "./authorSearch.module.css";


const AuthorSearch = () => {
    const {
        authors, setAuthors,
        searchQuery, setSearchQuery,
        isLoading, setIsLoading,

    } = useContext(AuthorSearchContext);

    const onSearchButtonClicked = () => {
        return fetchAuthors(searchQuery).then(response => setAuthors(response.users))
    }

    return (
        <section className={classes.authors_section}>
            <div className={classes.author_search}>
                <Search 
                    placeholder={"Search for authors..."} 
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    setIsLoading={setIsLoading}
                    onSearchClicked={onSearchButtonClicked}
                />
            </div>
        </section>    
    )
};

export default AuthorSearch;
