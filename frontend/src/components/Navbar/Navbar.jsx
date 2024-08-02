import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { logout } from '../../features/auth/authSlice';
function Navbar() {
    const {isLoggedin,user}=useSelector((state)=>state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const hanleOnLoginClick =()=> navigate('/login');
    const handleOnRegisterClick = ()=>navigate('/signup');
    const handleLogoutClick = ()=>{
          dispatch(logout());
          navigate('/login');
    }
  return (
      
    <div className='w-full bg-slate-800 text-2xl  pt-2 text-white h-[50px]'>
        <nav className='flex flex-row justify-between'>
            <ul className='flex flex-row  space-x-7'>
            <NavLink to={`/`}><li>Home</li> </NavLink>
            <NavLink to={'/mcqs'}><li> Mcqs</li></NavLink>
                <NavLink to={`/games`}> <li>Games</li> </NavLink>
            </ul>
            {
                !isLoggedin && ( <ul className='flex flex-row justify-evenly space-x-5'>
                    <button onClick={hanleOnLoginClick}>Login</button>
                    <button onClick={handleOnRegisterClick}>Register</button>
                </ul>
                )
            }
            {
                isLoggedin && (
                <ul className='flex flex-row justify-evenly space-x-5'>
                <div className='space-x-4'>{user}</div>
                <button onClick={handleLogoutClick
                }> Logout </button>
                </ul>
            )
            }
           
        </nav>
    </div>
  )
}

export default Navbar