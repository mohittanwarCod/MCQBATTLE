import React from 'react'

function Timer({remainingTime}) {
  const mint = remainingTime.minutes;
  const sec = remainingTime.seconds;
  return (
 
    <>

     <div className='flex flex-row w-[90px] bg-gray-50 border-2 border-blue-200 rounded-md absolute right-[100px] top-[200px]'>
      <div className='w-[40px] bg-slate-200 text-center border-1 border-gray-400 rounded-md'>
          {mint<10 ? "0"+mint:mint}
      </div>
      <div className=''>:</div>
   
      
      <div className='w-[40px] bg-slate-200 text-center border-1 border-gray-400 rounded-md'>
              {
        sec < 10 ? "0"+sec:sec
      }
      </div>
     </div>
        
    </>
  )
}

export default Timer