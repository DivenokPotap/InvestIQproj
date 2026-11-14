import React from "react";
import { ErrorMessage,Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useSignInMutation, useSignInWithGoogleMutation } from "@/redux/Auth/authApi";
import { useDispatch } from "react-redux";
import { setAuth,} from "@/redux/Auth/authSlice";
import css from "./LoginForm.module.css"
import google from "@/assets/google-symbol 1.svg"


const validationSchema = Yup.object({
    email: Yup.string().min(2, "Замало").max(70, "Задовго").email('Невірна адреса').required('Це обовʼязкове поле'),
  password: Yup.string().min(6, 'Потрібно 6 або білше символів').required('Це обовʼязкове поле'),
})

const LoginForm = ({onSwitchToRegister}) => {
    const [signIn, { }] = useSignInMutation();
    const [signInWithGoogle, { }] = useSignInWithGoogleMutation();
    const dispatch = useDispatch()
    const handleSubmit = async (userData, { resetForm }) => {
        try {
            const data = await signIn(userData).unwrap();

            dispatch(setAuth(data))
            resetForm()
        } catch (error) {
            console.log(error)
        }
       
    }
      const handleGoogle = async () => {
            try {
                const data = await signInWithGoogle().unwrap();

                dispatch(setAuth(data))
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
                <Form className={css.Form}>
                <div className={css.GoogleSection}>
                    <p className={css.text}>Ви можете авторизуватися за допомогою акаунта Google</p>
                    <button type="button" onClick={handleGoogle} className={css.Gbutton}><img src={google} alt="google" />Google</button>
                        <p className={css.text}>Або увійти за допомогою ел. пошти та праолю після реєстрації</p>
                </div>
                <div className={css.Inputs}>
                <label className={css.label} htmlFor="email">Електронна пошта:
                <Field className={css.Field} name="email" type="text" placeholder="example@mail.com" />
                <ErrorMessage className={css.Error} name="email" component="div"/>
                </label>
                
                <label className={css.label} htmlFor="password"> Пароль:
                <Field className={css.Field} name="password" type="text" />
                <ErrorMessage className={css.Error} name="password" component="div" />
                </label>
                </div>
                <div className={css.buttonsSection}>
                <button className={css.button1} type="submit">УВІЙТИ</button>
                <button className={css.button2} onClick={onSwitchToRegister} type="button">РЕЄСТРАЦІЯ</button>
                </div>
            </Form>
        </Formik>
        </div>
    )
}

export default LoginForm;