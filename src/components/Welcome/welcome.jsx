import { useState } from "react"
import LoginForm from "../LoginForm/LoginForm"
import RegisterForm from "../RegisterForm/RegisterForm"
import logo from '@/assets/logo.svg'
import css from "./welcome.module.css"
import bgImage from "@/assets/Group 87.svg";
import Rec65 from "@/assets/Rectangle 65.svg";
import Rec66 from "@/assets/Rectangle 66.svg";

const Welcome = () => {
    const [CurrentForm, setCurrentForm] = useState('login')
    return (
    <div className={css.container}>
    <header className={css.header}>
        <div className={css.Logo}>
        <img src={logo} alt="1" />
        <p>INVESTIQ</p>
        </div>  
            </header>
            <section>
                <img className={css.bgImage} src={bgImage} alt="1" />
                <div className={css.grey_bg}></div>
        <div className={css.welcomeTXT}>
        <h1 className={css.Invest}>InvestIQ</h1>
        <p className={css.smart}>SMART FINANCE</p> 
       <div className={css.Recs}> <img className={css.Rec65} src={Rec65} alt="65" />
        <img className={css.Rec66} src={Rec66} alt="66" /> </div>
                    <div className={css.Shadows}>
                    <div className={css.Shadow65}></div>
                    <div className={css.Shadow66}></div>
                    </div>
        </div>
        
        {CurrentForm === 'login' ? (<LoginForm onSwitchToRegister={() => setCurrentForm('register')} /> ) :
      (<RegisterForm onSwitchToLogin={() => setCurrentForm('login')}/>)}
            </section>
    
    </div>
)
}

export default Welcome