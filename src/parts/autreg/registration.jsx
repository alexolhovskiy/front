import { useDispatch } from "react-redux";
import { regUser } from "../../redux/slices/regSlice";
import { useState } from "react";

export const Registration=({setClose})=>{
    const dispatch=useDispatch();
    const [form, setForm] = useState({ username: '', password: '',email:'',color:null,r_password:''});

    const handleChange = e => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const regFunc=(e)=>{
        e.preventDefault();
        dispatch(regUser(form));
        setClose(false);
    }

    return(
        <div>
            <form onSubmit={regFunc} className="aut-box">
                
                <input name="username" type="text" onChange={handleChange} value={form.username} placeholder="Логин"/>
                <input name="password" type='password' onChange={handleChange} value={form.password} placeholder="Пароль"/>
                <input name="r_password" type='password' onChange={handleChange} value={form.r_password} placeholder="Пароль"/>
                <input name="email" type='email' onChange={handleChange} value={form.email} placeholder="Email"/>
                <input name="color" type='color' onChange={handleChange} value={form.color} placeholder="Email"/>
                <button type='submit'>Зарегистрироваться</button>
            </form>
        </div>
    );
}


