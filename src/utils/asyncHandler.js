const asyncHandler=(fn)=>async (req,res,next)=>{
    try {
       return  await fn(res,req,next)
    } catch (error) {
        console.log("hey an Error is occured at our End")
        return app.send(error)
        
    }
}
export {asyncHandler}