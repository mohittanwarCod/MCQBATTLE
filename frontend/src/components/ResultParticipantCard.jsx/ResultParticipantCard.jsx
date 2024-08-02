import React, { useEffect, useState } from 'react'

function ResultParticipantCard({details,score}) {
    const [username,setUsername]=useState("")
  

    const [id,setId]=useState("");

    useEffect(()=>{
        setUsername(details?.username)
        
        setId(details?._id)
     },[details])
    
  return (
    <>
     <div className='flex flex-row w-[90%] justify-around'>
        <div>{details?.username}</div>
        
        <div>{score}</div>

     </div>
    </>
    
  )
}

export default ResultParticipantCard