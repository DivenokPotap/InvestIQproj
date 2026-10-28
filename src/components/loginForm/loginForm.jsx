import React from "react";
import { ErrorMessage,Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useSignInMutation } from "@/redux/Auth/authApi";
import { useDispatch } from "react-redux";
import { setToken } from "@/services/api";
import { setAuthToken } from "@/redux/Auth/authSlice";
import css from "./loginForm.module.css"

const validationSchema = Yup.object({
    email: Yup.string().min(2, "Замало").max(70, "Задовго").email('Невірна адреса').required('Required'),
  password: Yup.string().min(6, 'Потрібно 6 або білше символів').required('Required'),
})

const LoginForm = ({onSwitchToRegister}) => {
    const [signIn, { isLoading, isError }] = useSignInMutation();
    const dispatch = useDispatch()
    const handleSubmit = async (userData, { resetForm }) => {
        try {
            const data = await signIn(userData).unwrap();
            setToken(data.token)

            dispatch(setAuthToken(data.token))
            resetForm()
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
                    <button className={css.Gbutton}>Google</button>
                        <p className={css.text}>Або увійти за допомогою ел. пошти та праолю після реєстрації</p>
                </div>
                <div className={css.Inputs}>
                <label className={css.label} htmlFor="email">Електронна пошта:
                <Field className={css.Field} name="email" type="text" placeholder="example@mail.com" />
                <ErrorMessage name="email" component="div"/>
                </label>
                
                <label className={css.label} htmlFor="password"> Пароль:
                <Field className={css.Field} name="password" type="text" />
                <ErrorMessage name="password" component="div" />
                </label>
                </div>
                <div className={css.buttonsSection}>
                <button className={css.button1} type="submit">УВІЙТИ</button>
                <button className={css.button2} onClick={onSwitchToRegister} >РЕЄСТРАЦІЯ</button>
                </div>
            </Form>
        </Formik>
        </div>
    )
}

export default LoginForm;