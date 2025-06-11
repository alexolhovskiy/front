import { useDispatch } from "react-redux";
import { useState } from "react";
import { loginUser } from "../../redux/slices/authSlice";

export const Autorisation=({setClose})=>{
    
    const dispatch=useDispatch();
    const [form, setForm] = useState({ email: '', password: '' });


    const handleChange = e => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
        
    };


    const autFunc=(e)=>{
        e.preventDefault();
        dispatch(loginUser(form));
        setClose(false);
    }


    return(
        <div>
            <form onSubmit={autFunc} className="aut-box">
                <input name="email" type="email" onChange={handleChange} value={form.username} placeholder="Email"/>
                <input name="password" type='text' onChange={handleChange} value={form.password} placeholder="Пароль"/>
                <button type='submit'>Войти</button>
            </form>
        </div>
    );
}