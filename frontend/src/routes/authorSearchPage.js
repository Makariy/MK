import React, {useEffect, useState} from "react";
import { fetchAuthors } from "../API/fetcher"

import Menu from "../components/commons/menu/menu"
import Loader from "../components/commons/loader/loader"
import AuthorSearch from "../components/UI/authorSearch/authorSearch";
import AuthorsList from "../components/UI/authorsList/authorsList";
import AuthorSearchContext from "../context/authorSearch"


const AuthorSearchPage = () => {
    
    const [authors, setAuthors] = useState(null);
    const [searchQuery, setSearchQuery] = useState({
        search_query: ""
    })
    const [isLoading, setIsLoading] = useState(true);

    useEffect(
        () => {
            setIsLoading(true);
            fetchAuthors(searchQuery).then(
                response => {
                    setAuthors(response.users)
                    setIsLoading(false);
                }
            )
        },
        []
    );


    return (
        <React.Fragment>
            <Menu />
            <AuthorSearchContext.Provider value={{
                authors: authors,
                setAuthors: setAuthors,

                searchQuery: searchQuery,
                setSearchQuery: setSearchQuery,

                isLoading: isLoading,
                setIsLoading: setIsLoading,
            }}>
                <div className={"container"} style={{
                    marginTop: "35px"
                }}>
                    <AuthorSearch />
                    {
                        isLoading ? 
                            <Loader />
                                :
                            <AuthorsList 
                                style={{
                                    marginTop: "55px;"
                                }}
                                authors={authors}
                            />
                    }

                </div>
 
            </AuthorSearchContext.Provider>
        </React.Fragment>
    )
}

export default AuthorSearchPage;
