import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { BASE_URL } from '../../constants/constant';
function GameCard({gameId,owner,status,userId,gameParticipants}) {
    const [roomName,setRoomName] = useState("");
    const [isGameOwner,setIsGameOwner]= useState(false);
    const joinGameHander=async ()=>{
    
        
       const response =  axios.get(`${BASE_URL}/api/v1/games/join/${gameId}`,{
        withCredentials:true,
       })
        // console.log(response)
    }

    
    useEffect(()=>{
      if(userId.toString()===owner._id.toString()){
        setIsGameOwner(true);
      }

    },[])
  
  return (
    <>
     <div className='relative gameCard-container w-[40%] flex flex-col border-2 border-blue-950 m-2 h-[100px]'>
     <div className='flex flex-col w-[90%]'>
     <div className="text-sm box-border w-full">GameId:{gameId}</div>
  
     <div className="text-sm box-border w-full">Created By: {owner.username.toUpperCase()} </div>
     </div>
    
   
    {status==="waiting" && <div className='bg-yellow-400 w-[20%] text-center text-white  p-1 box-content rounded-sm absolute bottom-1 left-1'>{status.toUpperCase()} </div>}
    {status==="completed" && <div className='bg-red-400 w-[25%] text-center text-white  p-1 box-content rounded-sm mb-1 absolute bottom-1 left-1'>{status.toUpperCase()} </div>}


    {status!=="completed" && !isGameOwner && <button onClick={joinGameHander} className='absolute  bottom-1 right-2 w-1/6 border-1 border-white bg-green-500 hover:bg-green-700 rounded-md p-1'> <Link to={`/games/play/${gameId}`}>JOIN Game </Link> </button>}
    {status!=="completed" && isGameOwner && <button onClick={joinGameHander} className='absolute bottom-1 right-2 w-1/6 border-1 border-white bg-green-500 hover:bg-green-700 rounded-md p-1'> <Link to={`/games/play-owner/${gameId}`}>VIEW Game </Link> </button>}
    {status==="completed" &&(gameParticipants.some(p=>p._id.toString()===userId.toString()) || owner._id.toString()===userId.toString()) && <button  className='absolute bottom-2 right-2 w-1/5 border-1 border-white bg-green-500 hover:bg-green-700 rounded-md p-1'> <Link to={`/games/result/${gameId}`}>View Result </Link> </button>}
    </div>
   </>
  )
}

export default GameCard