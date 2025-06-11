import { useSelector } from "react-redux";
import { Autorisation } from "./autorisation";
import { useEffect, useState } from "react";
import { Registration } from "./registration";

export const Window=({isOpen,setClose})=>{

    const[isLogin,setLogin]=useState(true);

    const handleClose=()=>{
        setClose(false);
    }

    if(isOpen){
        return(
            <div className="window">
                {   
                    isLogin?
                    <Autorisation setClose={setClose}/>:
                    <Registration setClose={setClose}/>
                }
                <div className="button-box">
                    <button className="window-button" onClick={()=>setLogin(!isLogin)}>{isLogin?"Зарегистрироваться":"Войти"}</button>
                    <button className="window-button" onClick={handleClose}>Отмена</button>

                </div>
            </div>
        );
    }
    return;
}