import React from "react";
import { ErrorMessage,Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useSignUpMutation } from "@/redux/Auth/authApi";
import css from "./RegisterForm.module.css"
import base from "@/components/baseStyles/baseStyles.module.css"
import clsx from "clsx";

const validationSchema = Yup.object({
  name: Yup.string().min(2, "Замало").max(70, "Задовго").required('Це обовʼязкове поле'),
  email: Yup.string().min(2, "Замало").max(70, "Задовго").email('Невірна адреса').required('Це обовʼязкове поле'),
  password: Yup.string().min(6, 'Потрібно 6 або білше символів').required('Це обовʼязкове поле'),
})

const RegisterForm = ({ onSwitchToLogin }) => {
    const [signUp, { isLoading, isError }] = useSignUpMutation();
    const handleSubmit = async (userData, { resetForm }) => {
        try {
            await signUp(userData).unwrap();

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
                <Form className={base.baseForm}>
                <div className={base.BaseInputs}>
                <label className={clsx(base.Baselabel, css.label)} htmlFor="name">Ім'я:
                <Field className={base.BaseField} name="name" type="text" />
                <ErrorMessage className={base.BaseError} name="name" component="div"/>
                </label>
                <label className={clsx(base.Baselabel, css.label)} htmlFor="email">Електронна пошта:
                <Field className={base.BaseField} name="email" type="text" />
                <ErrorMessage className={base.BaseError} name="email" component="div"/>
                </label>
                
                <label className={clsx(base.Baselabel, css.label)} htmlFor="password"> Пароль:
                 <Field className={base.BaseField} name="password" type="password" />
                 <ErrorMessage className={base.BaseError} name="password" component="div" />
                </label>
                </div>
                <div className={clsx(base.BasebuttonsSection, css.buttonSection)}>
                <button className={base.Basebutton2} onClick={onSwitchToLogin} type="button">УВІЙТИ</button>
                <button className={base.Basebutton1} type="submit">РЕЄСТРАЦІЯ</button>
                </div>
            </Form>
        </Formik>
        </div>
    )
}

export default RegisterForm;