import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { create, updateMcq ,deleteMcq} from '../../services/mcqServices';
import { MdDelete } from 'react-icons/md';
function McqCard({mcqVal}) {
const [formData,setFormData]= useState({});
const [mcqData,setMcqData]= useState({});
const dispatch = useDispatch();
const intialState={

  question:mcqVal?.question || '',
  option1:mcqVal?.options[0] || '',
  option2:mcqVal?.options[1] || '',
  option3:mcqVal?.options[2] || '',
  option4:mcqVal?.options[3] || '',
  answer:mcqVal?.correctAnswer || ''
}
const [questionId,setQuestionId]=useState("");
const [isEditing,setIsEditing] = useState(false);


useEffect(()=>{
    // console.log(mcqVal)
  setFormData(intialState);
  
  setQuestionId(mcqVal._id.toString());
},[])

const handleChange = (event)=>{
  const name = event.target.name
  const value = event.target.value
  
  setFormData((formData)=>({
    ...formData,
    [name]:value
  }))
}
const handleToggelEdit = (e)=>{
  e.preventDefault();
  setIsEditing(!isEditing);
}

const handleDeleteMcq = ()=>{
    
    dispatch(deleteMcq(questionId))
}
const handleSubmit = (event)=>{
    event.preventDefault();

    const mcqData = {
      question:formData.question,
      options:[formData.option1,formData.option2,formData.option3,formData.option4],
      correctOption:formData.answer
    }
    
 
    dispatch(updateMcq(
      {mcqData,questionId})
    )

   
  }



  return (
   
    <>
    
    <div className=' border-2 p-4 border-gray-400  rounded-md w-[480px] m-3'>
      <button onClick={handleDeleteMcq}> <MdDelete size="2rem" color='red' /> </button>
      <form className='flex flex-col ' onSubmit={handleSubmit} > 
        
        <textarea placeholder='Write your Question' name='question' value={formData.question} rows={5} disabled={!isEditing} onChange={handleChange} required className="mt-4 rounded-md border-[1px] border-gray-200 focus:outline-gray-200 resize-none p-2"/>
        <input type='text' placeholder='First Option' name='option1' value={formData.option1} disabled={!isEditing} onChange={handleChange} required className="mt-4 rounded-md border-[1px] border-gray-200 focus:outline-gray-200 resize-none p-2"/>
        <input type='text' placeholder='Second Option' name='option2' value={formData.option2} disabled={!isEditing} onChange={handleChange} required className="mt-4 rounded-md border-[1px] border-gray-200 focus:outline-gray-200 resize-none p-2"/>
        <input type='text' placeholder='Third Option' name='option3' value={formData.option3} disabled={!isEditing} onChange={handleChange} required className="mt-4 rounded-md border-[1px] border-gray-200 focus:outline-gray-200 resize-none p-2"/>
        <input type='text' placeholder='Forth Option' name='option4' value={formData.option4} disabled={!isEditing} onChange={handleChange} required className="mt-4 rounded-md border-[1px] border-gray-200 focus:outline-gray-200 resize-none p-2"/>
        <span className='w-full p-1 font-semibold'>Correct Answer</span>
        <input type='text' placeholder='Correct Answer' name='answer' value={formData.answer} disabled={!isEditing} onChange={handleChange} required className="mt-4 rounded-md border-[1px] border-gray-200 focus:outline-gray-200 resize-none p-2"/>
       
       <div className='flex flex-row justify-evenly space-x-5'>
       {!isEditing && <button className='outline outline-offset-2 outline-blue-500 mt-4 w-1/2 ' onClick={handleToggelEdit}>Edit</button>}
       {isEditing && <button className='outline outline-offset-2 outline-blue-500 mt-4 w-1/2 ' onClick={handleToggelEdit}>Discard</button>}
       <button type="submit" className='outline outline-offset-2 outline-blue-500 mt-4 w-1/2 text-black disabled:bg-slate-800 disabled:text-white disabled:cursor-not-allowed' disabled={!isEditing} >Update</button>
       </div>
      
      </form>
    </div>
   
    </>
  )
}

export default McqCard