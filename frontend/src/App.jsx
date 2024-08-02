
import { Outlet,Navigate, RouterProvider} from 'react-router-dom'
import Navbar from './components/Navbar/Navbar'
import { useEffect, useRef } from 'react'
import axios from 'axios'
import { useSelector,useDispatch } from 'react-redux'
import { authCheck, login, profile, signup } from './features/auth/authSlice'
import toast, { Toaster } from 'react-hot-toast'
import { createBrowserRouter } from 'react-router-dom'
import { BASE_URL } from './constants/constant'
import HomePage from './pages/HomePage'
import SignupPage from './pages/SignupPage'
import Games from './components/GamesList/Games'
import McqForm from './components/McqForm/McqForm'
import PlayGroundPage from './pages/PlayGroundPage'
import LoginPage from './pages/LoginPage'
import Layout from './components/Layout/Layout'
import McqPage from './pages/McqPage'
import PlayGroundOwnerPage from './pages/PlayGroundOwnerPage'
import ResultPage from './pages/ResultPage'

export const router = createBrowserRouter([

    {
      path:'/',
      element: <Layout/>,
      children:[
        {
           path:"",
           element:<HomePage />
        },
        { 
          path:'/login',
          element:<LoginPage />
        },
        {
          path:'/signup',
          element:<SignupPage />
        },
        {
          path:'/games',
          element:<Games/>
        },
        {
          path:'/mcqs',
          element:<McqPage />
        },
        {
          path:'/games/play/:roomId',
          element:<PlayGroundPage />
        },
        {
          path:'/games/play-owner/:roomId',
          element:<PlayGroundOwnerPage />
        },
        {
          path:'/games/result/:gameId',
          element:<ResultPage />
        }
        
      ]
  
    }
  ]);


function App() {
 
  const dispatch = useDispatch();
 
  useEffect(()=>{
    const userMe = async ()=>{
      await dispatch(authCheck())
    }
    userMe();
     
  
  },[])

   return (
   <> 
    
    <RouterProvider router={router} />
   <div>
  <Toaster
      position="top-right"
      toastOptions={{
          success: {
              theme: {
                  primary: '#4aed88',
              },
          },
      }}
  ></Toaster>
</div>
   </>
  )
}



export default App
