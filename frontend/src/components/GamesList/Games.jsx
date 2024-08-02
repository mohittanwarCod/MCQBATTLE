import React, { useEffect ,useState,useRef} from 'react'
import axios from 'axios'
import { BASE_URL } from '../../constants/constant';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import GameCard from '../GameCard/GameCard';
import ActiveGameCard from '../ActiveGameCard/ActiveGameCard';

import { ACTIONS, ROOMIDs } from '../../Action';
import { addGame ,createNewGame,listGames} from '../../features/game/gameSlice';
import { io } from 'socket.io-client';
import { initSocket } from '../../socket';
import { newGameData } from '../../utils/newGameData';

function Games() {
  const {user,userId} = useSelector(state=>state.auth)
   const socketRef = useRef(null); //TODO: USEREF USE change hone par render naa ho 
  

   // TODO: intialize socketref

   const {isLoading,waitingGames,error,completedGames} = useSelector(state=>state.games)
   const [activeGames,setActiveGames] = useState([]);
   

   const getActiveGames = async ()=>{
    const response = await axios.get(`${BASE_URL}/api/v1/games/active`,{
      withCredentials:true,
      headers:{
        "content-type": "application/json",
      }
      
    })

    // console.log(response.data.data)

    if(response.status){
      setActiveGames(response.data.data)
    }
   }


 
   
   
   useEffect(()=>{
     dispatch(listGames());
     getActiveGames();
     const init = async()=>{
       socketRef.current = await initSocket();
       socketRef.current.emit(ACTIONS.JOIN,{
        roomId:ROOMIDs.GAME_LIST,
        username:user,
        userId,
       
       })



       socketRef.current.on(ACTIONS.GAME_CREATED,(data)=>{
        toast.success('Game Created Successfully');
       dispatch(addGame(data));
       
   })

       // console.log(socketRef.current);
     }
    // console.log("user details",user);
    if(user) {init();


    return ()=>{
      // TODO: CLEANUP 
      socketRef.current.off(ACTIONS.JOIN)
      socketRef.current.off(ACTIONS.GAME_CREATED)
      socketRef.current.off(ACTIONS.GAME_CREATED)
      socketRef.current.disconnect();
    }
  }

   },[user])


 

   const dispatch = useDispatch();
   

  
   
  //  socket.on('connect', ()=>{
  //   // console.log('Connected to server')
   
  //  })

  //  socket.emit('join',{
  //   roomId:ROOMIDs.GAME_LIST,
  //   username:user
  //  })
  
   const createNewHandler = async()=>{
     dispatch(createNewGame(newGameData));
   }
   
 


  return (
    <>
      <button onClick={createNewHandler} className='text-xl bg-blue-500 hover:bg-blue-600 rounded-md p-2 text-white absolute right-4 top-[50px]'> Create New </button>
    <div className='text-center text-2xl'>GamesList</div>
    { 
         <div className='game-Container w-[90%]  flex flex-row flex-wrap justify-items-start mx-auto'>
       { waitingGames.map(game=>(
     
                  <GameCard key={game.gameId} gameId={game.gameId} owner={game.owner} status={game.status} userId={userId}/>
       
         
        ))}
        </div>
    }

{ 
         <div className=' game-Container w-[90%] flex lg:flex-row flex-wrap min-[320px]:flex-col  max-[640px]:text-sm justify-items-start items-center mx-auto'>
       { completedGames.map(game=>(
     
     (game.participants.some(p=>(p._id.toString()===userId.toString())) || game.owner._id.toString()===userId.toString()) && <GameCard key={game.gameId} gameId={game.gameId} owner={game.owner} status={game.status} userId={userId} gameParticipants={game.participants}/>
       
         
        ))}
        </div>
    }

    {
      activeGames.length > 0 && (
        <div className='game-Container w-[90%] flex lg:flex-row flex-wrap min-[320px]:flex-col  max-[640px]:text-sm justify-items-start items-center mx-auto'>
          {activeGames.map(game=>(
           game.participants.some(p=>(p._id.toString()===userId.toString())) && <ActiveGameCard key={game.gameId} gameId={game.gameId} owner={game.owner} status={game.status} userId={userId} gameParticipants={game.participants} socketRef={socketRef} user={user}/> 
          ))}
        </div>
      )
    }
    
   </>
    
  )
}

export default Games