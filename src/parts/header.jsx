import { Link } from "react-router-dom"
import { Window } from "./autreg/window";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/slices/authSlice";

export const Header=()=>{
    // const navigate=useNavigate();
    const dispatch = useDispatch();
    const [isOpen,setClose]=useState(false);
    const {isAuthenticated}=useSelector(store=>store.auth);

    const handleInOut=()=>{
        if(isAuthenticated){
            dispatch(logout());
        }else{
            setClose(true);
        }
    }

    return(
        <header>
            <Window isOpen={isOpen} setClose={setClose}/>
        
            <nav className="header">
                {/* <div className="logo">
                    Logo
                </div> */}
                <nav className="navigation">
                    {/* <Link to='/'>Home</Link> */}
                    {/* <Link to='/protected'>Protected</Link> */}
                    {/* <Link to='/login'>Sing up</Link> */}
                    <Link to='#' onClick={handleInOut}>{isAuthenticated ? 'Sing out' : 'Sing up'}</Link>
                </nav>
            </nav>
        </header>
    )
}