import { useState } from "react"
import LoginForm from "../loginForm/loginForm"
import RegisterForm from "../RegisterForm/RegisterForm"
import logo from '@/assets/logo.svg'
import css from "./welcome.module.css"

const Welcome = () => {
    const [CurrentForm, setCurrentForm] = useState('login')
    return (
    <div className={css.container}>
    <header>
        <div className={css.Logo}>
        <img src={logo} alt="1" />
        <p>INVESTIQ</p>
        </div>  
            </header>
            <section>
        <div className={css.welcomeTXT}>
        <h1>InvestIQ</h1>
        <p className={css.smart}>SMART FINANCE</p> 
        </div>
        {CurrentForm === 'login' ? (<LoginForm onSwitchToRegister={() => setCurrentForm('register')} /> ) :
      (<RegisterForm onSwitchToLogin={() => setCurrentForm('login')}/>)}
            </section>
    
    </div>
)
}

export default Welcome