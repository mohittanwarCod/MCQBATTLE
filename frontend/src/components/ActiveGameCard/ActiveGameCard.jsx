import React, { useEffect,useRef,useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import { Socket } from 'socket.io-client';
import { initSocket } from '../../socket';
import { ACTIONS } from '../../Action';

import { ROOMIDs } from '../../Action';

function ActiveGameCard(
    {gameId,owner,status,userId,gameParticipants,user}

) {
    
    const [isParticipant,setIsparticipant] = useState(false);

    const roomId = gameId.toString();
    useEffect(()=>{
        if(gameParticipants.some(p=>p._id.toString()===userId.toString())) setIsparticipant(true);

    },[])
    
    const socketRef = useRef(null);
    const joinGameHander= async ()=>{
        socketRef.current = await initSocket();

        socketRef.current.on(ACTIONS.JOINED,({clients,username,socketID})=>{
            if(username != user){
             // console.log(username," joined");
            }
   })

  await socketRef.current.emit(ACTIONS.JOIN,{
    roomId,username:user
  })

  socketRef.current.on('discone')

     

         
  
       
    }
    
    

  return (
    

     <>
     <div className='relative gameCard-container flex-auto w-1/3 flex flex-col border-2 border-blue-950 m-2 h-[100px]'>
     <div className='flex flew-row justify-between mx-3'>
     <div className="">GameId:{gameId}</div>
  
     <div className="">Created By: {owner.username.toUpperCase()} </div>
     </div>
    
   
    <div className='bg-green-500 w-[10%] text-center text-white mx-3'>{status} </div>
      <button className='absolute bottom-2 right-2 w-1/5 border-1 border-white bg-green-500 hover:bg-green-700 rounded-md p-1' onClick={joinGameHander}> <Link to={`/games/play/${gameId}`}>Resume </Link> </button>
    {/* {i <button onClick={joinGameHander} className='absolute bottom-2 right-2 w-1/5 border-1 border-white bg-green-500 hover:bg-green-700 rounded-md p-1'> <Link to={`/games/play-owner/${gameId}`}>VIEW Game </Link> </button>} */}

    </div>
   </>
  )
}

export default ActiveGameCard