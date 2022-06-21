import React, { useContext, useEffect, useState } from "react";
import classes from './postCreator.module.css';

import PostHeader from "../../commons/post/postHeader/postHeader";
import Input from '../../commons/UI/input/input';
import TextArea from "../../commons/UI/textarea/textarea";

import { postNewPostOnServer, redactPostOnServer } from "../../../API/interactor";
import CreatingContext from "../../../context/creating";


const PostCreator = ({author, createPost, setPost}) => {
    const {
        creatingPost, 
        setCreatingPost,

        isCreating,
        setIsCreating,

        isRedacting,
        setIsRedacting
    } = useContext(CreatingContext);

    const [hadChangedRedactingFile, setHadChangedRedactingFile] = useState(false)
    const [isPosting, setIsPosting] = useState(false)
    const publishRef = React.createRef();
    let interval = null;

    useEffect(() => {
        if (isPosting)
            interval = window.setInterval(() => {
                if (publishRef.current)
                    publishRef.current.style['background-color'] = ["yellow", "red", "blue", "purple"][Math.floor(Math.random() * 10) % 4]
            }, 200)
        else {
            window.clearInterval(interval)
            publishRef.current.style['background-color'] = "#2E7310";
        }
    }, [publishRef])

    const fileInputRef = React.createRef();

    const onInputFileClicked = () => {
        fileInputRef.current.click();
    }
    const onFileChange = (e) => {
        let new_post = {...creatingPost}
        if (isRedacting)
            setHadChangedRedactingFile(true)
        if (e.target.files.length == 0) {
            new_post.files = null;   
        }
        else {
            new_post.files = e.target.files;
        }
        setCreatingPost(new_post)
    }

    const onTitleChange = (e) => {
        let new_post = {...creatingPost}
        new_post.title = e.target.value;
        setCreatingPost(new_post)
    }

    const onDescriptionChange = (e) => {
        let new_post = {...creatingPost}
        new_post.text = e.target.value;
        setCreatingPost(new_post)
    }

    const removeFile = () => {
        let new_post = {...creatingPost}
        new_post.files = null
        fileInputRef.current.value = null;
        setCreatingPost(new_post)
    }

    const onPostPublish = () => {
        setIsPosting(true);
        if (isRedacting) {
            redactPostOnServer({
                post_uuid: creatingPost.uuid,
                title: creatingPost.title,
                text: creatingPost.text,
                files: creatingPost.files,
                hadChangedFile: hadChangedRedactingFile
            }).then(response => {
                setCreatingPost({
                    title: "",
                    text: "",
                    files: null
                })
                setIsRedacting(false)
                setIsCreating(false)
                setHadChangedRedactingFile(false)
                setIsPosting(false);
                setPost(response.post.uuid, response.post)
            }).catch(error => {
                setIsPosting(false);
                alert(JSON.stringify(error))
            })
        }
        else {
            postNewPostOnServer({
                title: creatingPost.title, 
                text: creatingPost.text,
                files: creatingPost.files,
            }).then(response => {
                setCreatingPost({
                    title: "",
                    text: "",
                    files: null
                })
                setIsPosting(false);
                setIsCreating(false);
                createPost(response.post);
            }).catch(error => {
                setIsPosting(false);
                alert(JSON.stringify(error))
            })
        }
    }

    const removeRedactFile = () => {
        setHadChangedRedactingFile(true)
    }

    return (
        <section className={[classes.post_creator_section, isCreating ? classes.active : ""].join(" ")}>
            <PostHeader author={author} date={"Now"}/>
            <div className={classes.post_creator_inputs}>
                <Input placeholder="Title..."
                    onChange={onTitleChange}
                    value={creatingPost.title}
                    styles={{
                        width: "70%"
                    }}
                    maxLength="63"
                />
                <TextArea placeholder="Description..." 
                    onChange={onDescriptionChange}
                    value={creatingPost.text}
                    type="text"
                    rows={window.screenY > 600 ? "7" : "10"}
                    maxLength="4000"
                />
            </div>
            <div className={classes.post_creator_footer}>
                <div className={classes.post_creator_footer_file}>
                    <input onChange={onFileChange} type="file" placeholder="Add file" ref={fileInputRef} className={classes.post_creator_footer_file_input}/>
                    <button onClick={onInputFileClicked} className={classes.post_creator_footer_file_button}>
                        Add file
                    </button>
                    <div className={classes.post_creator_footer_file_file}>
                        {creatingPost.files ? 
                            <React.Fragment>
                                <p className={classes.post_creator_footer_file_file_title}>
                                    {creatingPost.files[0].name.substr(0, 10)}
                                </p>
                                <button onClick={removeFile} className={classes.post_creator_footer_file_file_button}>
                                    X 
                                </button>
                            </React.Fragment>
                             : 
                             ""
                        }
                        {
                            isRedacting && !hadChangedRedactingFile && creatingPost.image_url ? 
                                <React.Fragment>
                                    <p className={classes.post_creator_footer_file_file_title}>
                                        {creatingPost.image_url.substr(creatingPost.image_url.indexOf('/', 2) + 1, 10)}
                                    </p>
                                    <button onClick={removeRedactFile} className={classes.post_creator_footer_file_file_button}>
                                        X 
                                    </button>
                                </React.Fragment>
                                    :
                                ""
                        }
                    </div>
                </div>
                <button ref={publishRef} className={classes.post_creator_footer_button} onClick={onPostPublish}>
                    Publish
                </button>
            </div>
        </section>
    );
}

export default PostCreator;
