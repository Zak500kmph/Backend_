

const asyncHandler = (fn) => async (req,res,next) => {
    try {
      await fn(req,res,next);
    } catch (error) {
      next(error);
    }
  };
// const asyncHandler=(fn)=>()=>{
//     (req,res,next)=>{
//     Promise.resolve(fn(res,req,next)).catch((err)=>console.log("Error Occur !!!!!!!!!!!1"))
//     }
// }
export {asyncHandler}