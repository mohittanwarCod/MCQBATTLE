import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { BASE_URL } from '../constants/constant';

import axios from 'axios';
import ResultParticipantCard from '../components/ResultParticipantCard.jsx/ResultParticipantCard';
function ResultPage() {
  let {gameId} = useParams();
  gameId = gameId.toString();
  const [game,setGame]=useState({});
  const [scores,setScores]=useState({});
  const [winnerId,setWinnerId]=useState("");
  const [winner,setWinner]=useState({});
  const [participantsDetailWithScore,setParticipantsDetailWithScore]=useState([]);
  const [participants,setParticipants] = useState([]);
  const getResult = async ()=>{
    const response = await axios.get(`${BASE_URL}/api/v1/games/result/${gameId}`,{
        withCredentials:true,
        headers:{
            'Content-Type': 'application/json',
        }
    })
   
    // console.log(response)

     
   setGame(response.data.data.game);
   setWinnerId(response.data.data.winner);
   setScores(response.data.data.scores);
   setParticipants(response.data.data.game.participants);
   

  }

  const getParticipantDetails = (userId)=>{
    const details = participants.filter(p=>p._id.toString()===userId.toString());
    // console.log(details)
    return details[0];
  }



  
  useEffect(()=>{
   getResult();
  

  },[])
   
 
 

  return (
    
   <>
    <div className='result-container'>
    <h1 className='text-center text-2xl'>Result Page</h1>
    <h2 className='text-xl'> <span className='text-2xl'> Game ID: </span> {gameId}</h2>
    <h2 className='text-xl'> <span className='text-2xl'> Winner:  </span>{winnerId && getParticipantDetails(winnerId).username}</h2>
    </div>
    <div className='w-[90%] flex flex-row justify-around'>
        <h2 className='text-2xl'> Username </h2>
        <h2 className='text-2xl'> Score </h2>
    </div>
    
   
    <div>
    
        {scores.length>0 && scores.map((p)=>(
              <ResultParticipantCard key={p[0]} details={getParticipantDetails(p[0])} score={p[1]}/>
        ))}
        

    </div>


    

   
  
   
   
   
   </>
  )
}

export default ResultPage