import React, { useEffect,useRef, useState} from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom'

import { ACTIONS } from '../Action';
import { initSocket } from '../socket';
import toast from 'react-hot-toast';
import ParticipantCard from '../components/ParticipantCard/ParticipantCard';
import axios from 'axios';
import { BASE_URL } from '../constants/constant';
import ActiveMcqCard from '../components/ActiveMcqCard/ActiveMcqCard';
import { getParticipantsRequest } from '../services/gameServices';
function PlayGroundOwnerPage() {
  const dispatch = useDispatch();
 
  const socketRef = useRef(null);
  const [gameJoinRequestStatus,setGameJoinRequestStatus]=useState("waiting");
  const {isLoggedin,user,userId}=useSelector((state)=>state.auth);
  const {roomId} = useParams()
  const gameId = roomId.toString();
 
  const [isGameStarted,setIsGameStarted]=useState(false);
  const [clients,SetClients]= useState([]);
  const [participantsRequests,SetParticipantsRequests]= useState([]);
  const [currentMcq,setCurrentMcq]=useState({});


  
  
  const startGameHandler =async (roomId)=>{
       const response =await axios.get(`${BASE_URL}/api/v1/games/start/${gameId}`,{
        withCredentials:true,

       })
       
       if(response.status){
        // console.log(response.data.data)
       }
  }
  
  const getParticipantsRequest = async ()=>{
    try{
        const response = await axios.get(`${BASE_URL}/api/v1/games/participantsRequest/${gameId}`,{
            withCredentials:true,
            headers:{
                'Content-Type': 'application/json',
            }
           
           })
     SetParticipantsRequests(response.data.data);
    }catch(err){
        // console.log(err);
    }
    
   

        
  }

  useEffect(()=>{
   getParticipantsRequest();
   
   
   
    
     
     
    const init = async ()=>{
      socketRef.current = await initSocket();
      
      socketRef.current.on('connect',()=>{
        // console.log('Connected to socket')
      })
      // console.log(user);
      socketRef.current.emit(ACTIONS.JOIN,{
        roomId,username:user
      })

      

      socketRef.current.on(ACTIONS.JOIN_REQUEST,({user,message,participantsRequest})=>{

        // console.log(user);
        toast.success(`${message}`);
        if(participantsRequest) SetParticipantsRequests(participantsRequest); 
        // console.log(participantsRequest);
      })

      socketRef.current.on(ACTIONS.JOINED,({clients,username,socketID})=>{
               if(username != user){
                // console.log(username," joined");
               }

               
               SetClients(clients);
               // console.log(clients);
      })

      socketRef.current.on('request-status',({message,status,owner,participantsRequest})=>{
         // console.log(message,status,owner,participantsRequest);
         if(status==="Accepted") toast.success(message)
         
         if(status==="Rejected") {toast.success(message) }
         if(participantsRequest) SetParticipantsRequests(participantsRequest)
      })

      socketRef.current.on('game-started',({message})=>{
          toast.success(message);
          setIsGameStarted(true);
      })

      socketRef.current.on('next-question',({data})=>{
        // console.log(data);
        setCurrentMcq(data);
      })

      socketRef.current.on(gameId,({message})=>{
        // console.log(message)
      })
  
     }
  
     if(user) {init();
      // console.log(userId);
    return ()=>{
      socketRef.current.off(ACTIONS.JOIN)
      socketRef.current.off(ACTIONS.JOIN_REQUEST)
      socketRef.current.off(ACTIONS.JOINED)
      socketRef.current.disconnect();

     }
    }

  },[gameJoinRequestStatus])
  return (
    <>
  {!isGameStarted && <div className=' flex gap-3 flex-col justify-center items-center'>
  {participantsRequests.length > 0 && participantsRequests.map((participantRequest)=>(
      <div key={participantRequest._id}><ParticipantCard gameId={roomId} participant={participantRequest} owner={user}/></div>
    ))
  }
  <button onClick={startGameHandler} className='bg-blue-400 rounded-md p-2 hover:bg-blue-600'>Start Game </button> 
    
  </div>
  }

  {
    Object.keys(currentMcq).length===0 && isGameStarted && <div>Loading</div>
  }
  {Object.keys(currentMcq).length}
  {
     Object.keys(currentMcq).length > 0 && <ActiveMcqCard mcq={currentMcq} gameId={gameId} userId={userId} owner={userId}/>
  }

  

    </>
  )
}


export default PlayGroundOwnerPage