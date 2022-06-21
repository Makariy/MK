import React, { useContext } from 'react';
import PostsContext from '../../../../context/posts';
import classes from './postSearchFilters.module.css';


const PostSearchFilters = ({isFilterActive}) => {

    const {searchQuery, setSearchQuery} = useContext(PostsContext);

    const setSearchQueryOrder = (value) => {
        let new_query = {...searchQuery}
        new_query.search_by = value
        setSearchQuery(new_query)
    }

    const textFilters = [
        {
            title: 'By title',
            handler: () => setSearchQueryOrder('title'),
        },
        {
            title: 'By text',
            handler: () => setSearchQueryOrder('text'),
        }
    ]

    const dateFilters = [
        {
            title: 'Today',
            handler: () => null
        },
        {
            title: 'Week ago',
            handler: () => null
        },
        {
            title: 'Month ago',
            handler: () => null
        },
        {
            title: 'Year ago',
            handler: () => null
        }
    ]
    

    return (
        <div 
            data-is-active={isFilterActive} 
            className={[classes.search__inner_filters, isFilterActive ? classes.active : ""].join(" ")}
        >
            <div className={classes.search__inner_filters_item}>
                <h4 className={classes.search__inner_filters_item_title}>
                    Filters:
                </h4>
                <div className={classes.search__inner_filters_item_selection}>
                    {
                        textFilters.map(filter => 
                            <div className={classes.search__inner_filters_item_selection_item} key={filter.title}>
                                <input type="radio" 
                                        name="textfilter" 
                                        onClick={filter.handler} 
                                        className={classes.search__inner_filters_item_selection_item_button}
                                    />

                                    <p className={classes.search__inner_filters_item_selection_item_text}>
                                        {filter.title}
                                    </p>
                                </div>)
                    }

                </div>
            </div>
            <div  className={classes.search__inner_filters_item}>
                <h4 className={classes.search__inner_filters_item_title}>
                    Date:
                </h4>
                <div className={classes.search__inner_filters_item_selection}>
                    {
                        dateFilters.map(filter => 
                            <div className={classes.search__inner_filters_item_selection_item} key={filter.title}>
                                <input type="checkbox" onClick={filter.handler} className={classes.search__inner_filters_item_selection_item_button}>
                                </input>
                                <p className={classes.search__inner_filters_item_selection_item_text}>
                                    {filter.title}
                                </p>
                            </div>)
                    }
                </div>
            </div>

        </div>
    );
}

export default PostSearchFilters;
