import classes from './login.module.scss'
import Image from "next/image";
import Form from "../../../shared/components/form/form";
import * as Yup from "yup";
import {useRef} from "react";

export const Login  = () => {
    const formRef: any =  useRef(null);
    const formState = [
        {
            name: 'email',
            type: 'input',
            label: `Email`,
            placeholder: 'Email',
            maxlength: 50,
            maxCharacter: 50,

        },
        {
            name: 'password',
            type: 'password',
            maxlength: 6,
            label: 'password',
            minimumValue: 0,
            decimalScale: 0,
        }];
    return (
        <>
            <div className={classes.loginMain} >
                <div className={classes.sectionMain}>
                <div className={classes.left}>
                    <img src={'images/logo.svg'} className={classes.logo}/>
                    <div className={classes.loginFormmain}>
                            <h1>Welcome to Oat Foundry</h1>
                            <span>Welcome back! Please enter your details.</span>


                    </div>
                </div>
                <div className={classes.right}>
                    <img src={'images/flapboard.svg'} className={classes.logo}/>
                </div>
                </div>


            </div>


        </>
    )
}
