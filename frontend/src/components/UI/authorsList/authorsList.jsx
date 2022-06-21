import React, { useContext } from "react";
import AuthorSearchContext from "../../../context/authorSearch";
import Author from "./author/author";
import classes from "./authorsList.module.css"


const AuthorsList = ({authors}) => {

    return (
        <div className={classes.authors_list_section} style={{marginBottom: "100px"}}>
            {
                authors.map(author => 
                    <Author author={author.user} key={author.user.uuid}/>
                )
            }
        </div>
    );
}

export default AuthorsList;
