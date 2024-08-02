import React, { useDebugValue, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getMcq } from '../features/mcqs/mcqSlice';
import McqCard from '../components/McqCard/McqCard';
import McqForm from '../components/McqForm/McqForm';
import { MdCancel } from "react-icons/md";

function McqPage() {
   const {mcqs} = useSelector((state)=>{
   return state.mcqs
   
})
   const dispatch = useDispatch();
   const [createNew,setCreateNew] = useState(false);
   const toggleCreateNew = (createNew)=>{
    setCreateNew(!createNew);
   }
  
   useEffect(()=>{
    dispatch(getMcq());
     
   },[])

  return (
    <>
  
{!createNew && <button onClick={()=>{setCreateNew(!createNew)} } className='w-auto p-2 m-3 hover:bg-slate-900 border-1 bg-gray-700 text-gray-300 rounded-md  '> Create New</button> }
{createNew && <button onClick={()=>{setCreateNew(!createNew)} } className='w-auto p-2 m-3 hover:bg-red-900 border-1 bg-red-700 text-gray-300 rounded-md  '><MdCancel size={"20px"} color='r'/></button> } 
 {
  createNew && <McqForm createNew={createNew} toggleCreateNew={toggleCreateNew}/>
 }   

{!createNew && <div className='flex flex-row flex-wrap alig gap-4 w-[80%] mx-auto justify-items-start'>
     { mcqs.map((mcq)=>(
       
           <McqCard key={mcq._id} mcqVal={mcq}/> 
         
      ))
}
    </div> 

}
    </>

  )
}

export default McqPage