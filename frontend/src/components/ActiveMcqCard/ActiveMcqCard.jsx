import axios from 'axios'
import React, { useEffect } from 'react'
import { useState } from 'react'
import { BASE_URL } from '../../constants/constant'
function ActiveMcqCard({mcq,gameId,userId,answerStatus,owner}) {
  
    const question = mcq.question
    const option_A = mcq.options[0]
    const option_B = mcq.options[1]
    const option_C = mcq.options[2]
    const option_D = mcq.options[3]
    const [checkedOption,setCheckedOption] = useState("");
    const [selectedOption,setSelectedOption] = useState("");
    const [isDisabled,setIsDisabled] = useState(false);
    
    const handleOptionChange = (e) => {
        setSelectedOption(e.target.value);
        // console.log(e.target.name);
        setCheckedOption(e.target.name);
    }
    const handleSubmit = (e)=>{
        e.preventDefault();
        axios.post(`${BASE_URL}/api/v1/games/submit/${gameId}`,{answer:selectedOption,gameId,userId,questionId:mcq._id},{
            withCredentials: true,
        })
        setIsDisabled(true);
        // console.log(`You chose: ${selectedOption}`);
        
    }
    useEffect(()=>{
        setSelectedOption("")
        setCheckedOption("")

        setIsDisabled(false)
        if(owner){
          setIsDisabled(true);
      
         }
    },[mcq])
  return (

    <div className='top-level w-[100%]  mx-auto top-1/3 absolute  text-xl'>
    <div className='container w-[90%] border-2 mx-auto flex flex-col gap-3 relative'>
          <h2 className='h-auto my-4 mx-3'>{question}</h2>
          <form onSubmit={handleSubmit}>
        <div className='flex flex-col gap-3 w-full h-auto px-4 py-4 box-border'>
          <div className='w-[100%] border-2 flex flex-row gap-2 px-2 py-2'>
            <input type="radio" id="option_A" name="option_A" checked={checkedOption==="option_A"} value={option_A} disabled={isDisabled} onChange={handleOptionChange}  />
            <label htmlFor="option_A" className='w-full border-1'>{option_A}</label>
          </div>
          <div className='w-[100%] border-2 flex flex-row gap-2  px-2 py-2'>
            <input type="radio" id="option_B" name="option_B" value={option_B} checked={checkedOption==="option_B"} disabled={isDisabled} onChange={handleOptionChange} />
            <label htmlFor="option_B" className='w-full border-1'>{option_B}</label>
          </div>
          <div className='w-[100%] border-2 flex flex-row gap-2  px-2 py-2'>
            <input type="radio" id="option_C" name="option_C" value={option_C} checked={checkedOption==="option_C"} disabled={isDisabled} onChange={handleOptionChange}/>
            <label htmlFor="option_C" className='w-full border-1'>{option_C}</label>
          </div>
          <div className='w-[100%] border-2 flex flex-row gap-2  px-2 py-2'>
            <input type="radio" id="option_D" name="option_D" value={option_D} checked={checkedOption==="option_D"} disabled={isDisabled} onChange={handleOptionChange}/>
            <label htmlFor="option_D" className='w-full border-1'>{option_D}</label>
          </div>  
          
          <button type='submit' className='absolute bottom-[-3.5rem] bg-blue-600 hover:bg-blue-800  p-3 rounded-md text-white disabled:cursor-not-allowed' disabled={isDisabled}>Submit</button>
          </div> 
          </form>
    </div>
    </div>
    
  )
}

export default ActiveMcqCard