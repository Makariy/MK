import React from "react"
import classes from './postSearchCreation.module.css';


const PostSearchCreation = ({withCreation, toggleIsCreating, isCreating}) => {
    return (
        <React.Fragment>
            {
                withCreation ? 
                    <button 
                        data-is-creating={isCreating} 
                        className={[classes.search__post_creation, isCreating ? classes.active : ""].join(" ")} 
                        onClick={toggleIsCreating}
                    >
                        {
                            !isCreating ? "Add post" : "Editing..."
                        }
                    </button>
                        :
                    ""
            }
        </React.Fragment>
    );
}

export default PostSearchCreation;
