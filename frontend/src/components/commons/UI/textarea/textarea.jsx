import React from 'react';
import classes from './textarea.module.css';



const TextArea = React.forwardRef(({styles, textarea_styles, ...other}, ref) => {

    return (
        <div style={styles} className={classes.textarea_block}>
            <textarea style={textarea_styles} {...other} ref={ref} className={classes.textarea}/>
        </div>
    );
});

export default TextArea;
