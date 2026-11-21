import React, { use, useState } from "react";
import { ErrorMessage,Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useSignInMutation, useSignInWithGoogleMutation } from "@/redux/Auth/authApi";
import css from "./LoginForm.module.css"
import google from "@/assets/google-symbol 1.svg"
import base from "@/components/baseStyles/baseStyles.module.css"
import visibility from "@/assets/visibility.svg"
import visibilityOff from "@/assets/visibility_off.svg"


const validationSchema = Yup.object({
    email: Yup.string().min(2, "Замало").max(70, "Задовго").email('Невірна адреса').required('Це обовʼязкове поле'),
  password: Yup.string().min(6, 'Потрібно 6 або білше символів').required('Це обовʼязкове поле'),
})

const LoginForm = ({onSwitchToRegister}) => {
    const [signIn, { }] = useSignInMutation();
    const [signInWithGoogle, { }] = useSignInWithGoogleMutation();
    const[showPassword, setShowPassword] = useState(false);
    const handleSubmit = async (userData, { resetForm }) => {
        try {
            await signIn(userData).unwrap();

            resetForm()
        } catch (error) {
            console.log(error)
        }
       
    }
      const handleGoogle = async () => {
            try {
                await signInWithGoogle().unwrap();
            } catch (error) {
                console.log(error)
            }
      }
    
    return(
    <div>
        <Formik
            initialValues={{
                email: '',
                password: '',
            }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                <Form className={base.baseForm}>
                <div className={css.GoogleSection}>
                    <p className={css.Gtext}>Ви можете авторизуватися за допомогою акаунта Google</p>
                    <button type="button" onClick={handleGoogle} className={css.Gbutton}><img src={google} alt="google" />Google</button>
                        <p className={css.text}>Або увійти за допомогою ел. пошти та паролю після реєстрації</p>
                </div>
                <div className={base.BaseInputs}>
                <label className={base.Baselabel} htmlFor="email">Електронна пошта:
                <Field className={base.BaseField} name="email" type="text" placeholder="example@mail.com" />
                <ErrorMessage className={base.BaseError} name="email" component="div"/>
                </label>
                
                <label className={base.Baselabel} htmlFor="password"> Пароль:
                <Field className={base.BaseField} name="password" type={showPassword ? 'text' : 'password'} />
                <ErrorMessage className={base.BaseError} name="password" component="div" />
                <button className={base.visibilityBTN} onClick={() => setShowPassword((prev) => !prev)}><img src={showPassword ? visibilityOff : visibility} alt="visibility"/></button>
                </label>
                </div>
                <div className={base.BasebuttonsSection}>
                <button className={base.Basebutton1} type="submit">УВІЙТИ</button>
                <button className={base.Basebutton2} onClick={onSwitchToRegister} type="button">РЕЄСТРАЦІЯ</button>
                </div>
            </Form>
        </Formik>
        </div>
    )
}

export default LoginForm;