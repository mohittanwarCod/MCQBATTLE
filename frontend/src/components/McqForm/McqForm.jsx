import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { create } from '../../services/mcqServices';
import { Navigate, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
function McqForm({createNew,toggleCreateNew}) {
const [formData,setFormData]= useState({});
const [mcqData,setMcqData]= useState({});
const dispatch = useDispatch();

const intialState={
  question:'',
  option1:'',
  option2:'',
  option3:'',
  option4:'',
  answer:''
}

const navigate = useNavigate();

useEffect(()=>{
  setFormData(intialState);
},[])
const handleChange = (event)=>{
  const name = event.target.name
  const value = event.target.value
  
  setFormData((formData)=>({
    ...formData,
    [name]:value
  }))
}

const handleSubmit = (event)=>{
    event.preventDefault();

    const mcqData = {
      question:formData.question,
      options:[formData.option1,formData.option2,formData.option3,formData.option4],
      correctAnswer:formData.answer
    }
    
 
    dispatch(create(
      mcqData)
    )
     toast.success("New Mcq Created Successfully")
    toggleCreateNew(createNew)
     

    
   
  }



  return (
   
    <>
    <div className='w-[480px] mx-auto absolute left-1/3 text-center top-1/4 border-2 p-4 border-gray-400  rounded-md'>
      <form className='flex flex-col w-full ' > 
        <textarea placeholder='Write your Question' name='question' value={formData.question} rows={5} onChange={handleChange} required className="mt-4 rounded-md border-[1px] border-gray-200 focus:outline-gray-200 resize-none p-2"/>
        <input type='text' placeholder='First Option' name='option1' value={formData.option1} onChange={handleChange} required className="mt-4 rounded-md border-[1px] border-gray-200 focus:outline-gray-200 resize-none p-2"/>
        <input type='text' placeholder='Second Option' name='option2' value={formData.option2} onChange={handleChange} required className="mt-4 rounded-md border-[1px] border-gray-200 focus:outline-gray-200 resize-none p-2"/>
        <input type='text' placeholder='Third Option' name='option3' value={formData.option3} onChange={handleChange} required className="mt-4 rounded-md border-[1px] border-gray-200 focus:outline-gray-200 resize-none p-2"/>
        <input type='text' placeholder='Forth Option' name='option4' value={formData.option4} onChange={handleChange} required className="mt-4 rounded-md border-[1px] border-gray-200 focus:outline-gray-200 resize-none p-2"/>
        <input type='text' placeholder='Correct Answer' name='answer' value={formData.answer} onChange={handleChange} required className="mt-4 rounded-md border-[1px] border-gray-200 focus:outline-gray-200 resize-none p-2"/>

       <button className='outline outline-offset-2 outline-blue-500 mt-4' onClick={handleSubmit}>Create</button>
      </form>
    </div>
    </>
  )
}

export default McqForm