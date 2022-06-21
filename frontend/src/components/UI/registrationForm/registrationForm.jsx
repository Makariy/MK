import React, { useContext, useState } from "react";
import classes from './registrationForm.module.css';

import Input from '../../commons/UI/input/input';
import { registerOnServer } from "../../../API/authorizer";

import AuthContext from "../../../context/auth";
import Loader from "../../commons/loader/loader";

import { Link } from "react-router-dom";


const RegistrationForm = () => {
    const {setUser} = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(false);

    const [error, setError] = useState("");

    const usernameRef = React.createRef();
    const passwordRef = React.createRef();
    const emailRef = React.createRef();

    
    const onSubmitClicked = (e) => {
        e.preventDefault();
        setIsLoading(true);

        registerOnServer(usernameRef.current.value, passwordRef.current.value, emailRef.current.value)
            .then(response => {
                setUser(response.user);
                localStorage.setItem('auth', JSON.stringify(response.user));
            })
            .catch(exception => {
                setError(exception.message.error);
                setIsLoading(false);
            });
    }   


    return (
        <React.Fragment>
            {
                isLoading ? 
                    <Loader />
                        :
                        <section className={classes.login_section}>
                        <div className="container">
                            <div className={classes.login__inner}>

                                <div className={classes.login__greeting}>
                                    <img src={"/static/login.svg"} className={classes.login__greeting_img}/>
                                    <h3 className={classes.login__greeting_title}>
                                        Welcome
                                    </h3>
                                </div>
                                <form className={classes.login__form}>
                                    <div className={classes.login__form_inputs}>
                                        <div className={classes.login__form_inputs_item}>
                                            <h5 className={classes.login__form_inputs_item_title}>
                                                Username:
                                            </h5>
                                            <Input ref={usernameRef} placeholder="Enter your username..."/>
                                        </div>
                                        <div className={classes.login__form_inputs_item}>
                                            <h5 className={classes.login__form_inputs_item_title}>
                                                Password:
                                            </h5>
                                            <Input type="password" ref={passwordRef} placeholder="Enter your password..."/>
                                        </div>
                                        <div className={classes.login__form_inputs_item}>
                                            <h5 className={classes.login__form_inputs_item_title}>
                                                Email:
                                            </h5>
                                            <Input type="email" ref={emailRef} placeholder="Enter your email..."/>
                                        </div>
                                    </div>
                
                                    <div className={classes.login__form_error}>
                                        <p className={classes.login__form_error_text}>
                                            {error}
                                        </p>
                                    </div>
                
                                    <div className={classes.login__form_footer}>
                                        <div className={classes.login__form_footer_remember}>
                                            <input type="checkbox" className={classes.login__form_footer_remember_checkbox}/>
                                            <p className={classes.login__form_footer_remember_text}>
                                                Remember me
                                            </p>
                                        </div>
                                        <div className={classes.login__form_footer_restore_password}>
                                            <a href="#">
                                                Forgot your password?
                                            </a>
                                        </div>
                                    </div>
                                    <div className={classes.login__form_submit}>
                                        <input value="Enter" type="submit" onClick={onSubmitClicked} className={classes.login__form_submit_button}/>
                                    </div>
                                    <div className={classes.login__form_other}>
                                        <Link to="/login/">
                                            Already registered?
                                        </Link>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </section>    
        }
        </React.Fragment>
    );
}

export default RegistrationForm;

