import React from "react";
import { ErrorMessage,Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useSignUpMutation } from "@/redux/Auth/authApi";
import { useDispatch } from "react-redux";
import { setToken } from "@/services/api";
import { setAuthToken } from "@/redux/Auth/authSlice";
import css from "./RegisterForm.module.css"

const validationSchema = Yup.object({
  name: Yup.string().min(2, "Замало").max(70, "Задовго").required('Required'),
  email: Yup.string().min(2, "Замало").max(70, "Задовго").email('Невірна адреса').required('Required'),
  password: Yup.string().min(6, 'Потрібно 6 або білше символів').required('Required'),
})

const RegisterForm = ({ onSwitchToLogin }) => {
    const [signUp, { isLoading, isError }] = useSignUpMutation();
    const dispatch = useDispatch()
    const handleSubmit = async (userData, { resetForm }) => {
        try {
            const data = await signUp(userData).unwrap();
            console.log(data)
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
                name: '',
                email: '',
                password: '',
            }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                <Form className={css.Form}>
                <div className={css.Inputs}>
                <label className={css.label} htmlFor="name">Ім'я:
                <Field className={css.Field} name="name" type="text" />
                <ErrorMessage name="name" component="div"/>
                </label>
                <label className={css.label} htmlFor="email">Електронна пошта:
                <Field className={css.Field} name="email" type="text" />
                <ErrorMessage name="email" component="div"/>
                </label>
                
                <label className={css.label} htmlFor="password"> Пароль:
                <Field className={css.Field} name="password" type="text" />
                <ErrorMessage name="password" component="div" />
                </label>
                </div>
                <div className={css.buttonsSection}>
                <button className={css.button2} onClick={onSwitchToLogin}>УВІЙТИ</button>
                <button className={css.button1} type="submit">РЕЄСТРАЦІЯ</button>
                </div>
            </Form>
        </Formik>
        </div>
    )
}

export default RegisterForm;