import React, { StrictMode, lazy } from 'react'
import ReactDOM from 'react-dom/client'
import App, { router } from './App.jsx'
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { store } from './app/store.js'
import { Provider, useDispatch } from 'react-redux'
import { Toaster } from 'react-hot-toast'
import HomePage from './pages/HomePage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import SignupPage from './pages/SignupPage.jsx'
import Games from './components/GamesList/Games'
import McqForm from './components/McqForm/McqForm.jsx'
import PlayGroundPage from './pages/PlayGroundPage.jsx'


// const HomePage = lazy(()=>import('./pages/HomePage.jsx'))
// const LoginPage = lazy(()=>import('./pages/LoginPage.jsx'))
// const SignupPage = lazy(()=>import('./pages/SignupPage.jsx'))
// const Games = lazy(()=>import('./components/GamesList/Games'))
// const McqForm = lazy(()=>import('./components/McqForm/McqForm.jsx'))
// const PlayGroundPage = lazy(()=>import('./pages/PlayGroundPage.jsx'))




ReactDOM.createRoot(document.getElementById('root')).render(
  


  <Provider store={store}>
  
 
  <App />
 
  
 
  </Provider>
  
 

)
