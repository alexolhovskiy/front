import { useEffect, useState } from 'react';
import { Header } from './parts/header';
import { fetchSimple } from './redux/slices/simpleSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Footer } from './parts/footer';

export const Home=()=>{
    const dispatch = useDispatch();
    const {message}=useSelector(store=>store.hello);

    useEffect(() => {
        dispatch(fetchSimple({url:'/api/hello',data:{}}));
    }, []);

    return(
        <>
            <Header/> 
            <div className='container'>{message}</div>
            <Footer/>
        </>
        
    )
}