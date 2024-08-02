import axios from 'axios'
import React from 'react'
import { BASE_URL } from '../../constants/constant'

function ParticipantCard({gameId,participant,owner}) {
    const credentials = {gameId,participant,owner};

    const acceptRequesthandler= async ()=>{
       const response =  axios.post(`${BASE_URL}/api/v1/games/accept/${gameId}`,{
        gameId,
        participant,
        owner

       });
       // console.log(response);


    }

    const rejectRequestHandler= async ()=>{
       const response =  axios.post(`${BASE_URL}/api/v1/games/reject/${gameId}`,{
        gameId,
        participant,
        owner
      },{
        withCredentials:true,
        httpOnly:true,
        headers:{
          "Content-Type": "application/json",
        },
      }
      )} 

  return (
   <>
   <div className='border-1 border-gray-400 bg-gray-300 rounded-md w-auto p-4'>
    <h4 className='text-xl'> <span className='text-2xl'>Username:</span>{participant.username}</h4>
    <div className='flex text-center justify-center gap-3'>
    <button onClick={acceptRequesthandler} className='text-lg bg-green-500 hover:bg-green-700 rounded-md p-1'>Accept</button> 
    <button onClick={rejectRequestHandler} className='text-lg bg-red-500 hover:bg-red-700 rounded-md p-1'>Reject</button>
    </div>
 
   </div>
   </>
  )
}

export default ParticipantCard