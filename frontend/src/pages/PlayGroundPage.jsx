import React, { useEffect,useRef, useState} from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom'

import { ACTIONS } from '../Action';
import { initSocket } from '../socket';
import toast from 'react-hot-toast';
import ParticipantCard from '../components/ParticipantCard/ParticipantCard';
import axios from 'axios';
import { BASE_URL } from '../constants/constant';
import ActiveMcqCard from '../components/ActiveMcqCard/ActiveMcqCard';
import { setCurrentMcq, setGameRemTime, setIsGameStarted, setIsParticpant } from '../features/game/gameSlice';
import Timer from '../components/Timer/Timer';
import Loader from '../components/Loader/Loader';

function PlayGroundPage() {
  const socketRef = useRef(null);
  const [gameJoinRequestStatus,setGameJoinRequestStatus]=useState("waiting");
  const {isLoggedin,user,userId}=useSelector((state)=>state.auth);
  const {roomId} = useParams()
  const gameId = roomId.toString();
  const [isLoading,setIsLoading] = useState(true);
   
  
  const [clients,SetClients]= useState([]);
  const [participantsRequests,SetParticipantsRequests]= useState([]);
  // const [currentMcq,setCurrentMcq]=useState({});
  const {currentMcq,gameRemTime,isGameStarted,isParticipant} =  useSelector((state)=>state.games);
  const dispatch = useDispatch();

  const [answerStatus,setAnswerStatus]=useState("");
 
  const [gameCompleted,setGameCompleted]=useState(false);

  const navigate = useNavigate();
  const startGameHandler =async (roomId)=>{
       const response =await axios.get(`${BASE_URL}/api/v1/games/start/${gameId}`,{
        withCredentials:true,

       })

  
       if(response.status){
        // console.log(response.data.data)
       }
  }

  const participantStatus = async ()=>{
    const response = await axios.get(`${BASE_URL}/api/v1/games/participants/status/${gameId}`,{
         withCredentials:true,
         httpOnly:true,
         headers:{
             'Content-Type': 'application/json',
         }
    })

    

    if(response.status){
        // // console.log(response.data.data)
        // // console.log("axios",response.data.data.status);
        // setIsParticpant(response.data.data.status);
        dispatch(setIsParticpant(response.data.data.status))
      
    }
  }
   
 
  
 


  useEffect(()=>{
    
    
   
  
   

     
     
    const init = async ()=>{
      socketRef.current = await initSocket();
      
      socketRef.current.on('connect',()=>{
        // console.log('Connected to socket')  
      })
      // // console.log(user);
     if(gameJoinRequestStatus==="Accepted" || isGameStarted){ socketRef.current.emit(ACTIONS.JOIN,{
        roomId,username:user
      })
      
    }

      

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

      socketRef.current.on('request-status',({message,status,owner})=>{
         // console.log(message,status,owner);

         if(status==="Accepted"){
          toast.success(message)
          setGameJoinRequestStatus("Accepted");
         } 

         if(status==="Rejected"){
          toast.error(message);
          setGameJoinRequestStatus("Rejected");
          navigate('/games');
         }


      })

      socketRef.current.on('game-started',({message})=>{
        setIsLoading(false);
          toast.success(message);
          dispatch(setIsGameStarted(true));
         
          // setIsGameStarted(true);
          
      })

      socketRef.current.on('next-question',({data})=>{
        setIsLoading(false);
        setAnswerStatus("");
       
        dispatch(setCurrentMcq(data));
      })

      socketRef.current.on(gameId,({message})=>{
        // console.log(message)
      })

      socketRef.current.on('submit-response',({message,status})=>{
        setAnswerStatus(status);
        if(status === 'correct'){
          toast.success(message)
        }else{
          toast.error(message)
        }
      })

      socketRef.current.on('game-completed',({status,message})=>{
        toast.success(message)
        // setIsGameStarted(false);

        // setCurrentMcq({});
        dispatch(setCurrentMcq({}))
        setAnswerStatus("");
        setGameCompleted(true);
          
          navigate(`/games/result/${gameId}`)

        
        
      })


      socketRef.current.on('timer',({remainingTime})=>{
        // console.log("timer",remainingTime);
      

        const seconds = Math.floor((remainingTime % (60 * 1000)/1000));
        const minutes = Math.floor(remainingTime / (60 * 1000));
        dispatch(setGameRemTime({minutes,seconds}))

      })
  
     }
  
     if(user) {init();
      // console.log(userId);
    return ()=>{
      socketRef.current.off(ACTIONS.JOIN)
      socketRef.current.off(ACTIONS.JOIN_REQUEST)
      socketRef.current.off(ACTIONS.JOINED)
      setCurrentMcq({});
     
      // socketRef.current.disconnect();

     }
    }

  },[gameJoinRequestStatus,isGameStarted])
  return (
    <>
    {!isGameStarted &&isLoading && <Loader /> }
  {!isGameStarted && <div>
  {participantsRequests.length > 0 && participantsRequests.map((participantRequest)=>(
      <div key={participantRequest._id}><ParticipantCard gameId={roomId} participant={participantRequest} owner={user}/></div>
    ))
  }
   
    
  </div>
  }
  {/* {
    // console.log("participant",isParticpant)
  } */}
  {
    isGameStarted && <div> <Timer remainingTime={gameRemTime} /></div>
  }
  

 

  {
    Object.keys(currentMcq).length===0 && isGameStarted && <div>Loading</div>
  }
 
  {
     Object.keys(currentMcq).length > 0 && <ActiveMcqCard mcq={currentMcq} gameId={gameId} userId={userId} answerStatus={answerStatus}/>
  }

  

    </>
  )
}

export default PlayGroundPage