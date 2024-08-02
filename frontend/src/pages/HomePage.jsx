import React, { useEffect } from 'react'
import App from '../App'
import { connect, useDispatch, useSelector } from 'react-redux'
import axios from 'axios';
import { profile } from '../features/auth/authSlice';
import Navbar from '../components/Navbar/Navbar';
import Loader from '../components/Loader/Loader';
;
function HomePage({children}) {
    const {isLoading,error} = useSelector((state) => state.auth);
    
  return (
    <>
   
    
    

  
    <img src="/assests/HomePageImg.jpeg"  className='h-svh w-full overflow-hidden bg-cover'/>
    {error && <div>{error}</div>}
    
    </>
  )
}

export default HomePage