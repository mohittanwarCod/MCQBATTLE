import Queue from "bull"
import questionWorker from "../worker/questionWorker.js";



 const questionQueue = new Queue('questionQueue');

 questionQueue.process(questionWorker);

 export default questionQueue;