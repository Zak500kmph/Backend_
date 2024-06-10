const asyncHandler=(fn)=>async (req,res,next)=>{
    try {
        await fn(res,req,next)
    } catch (error) {
        console.log("hey an Error is occured at our End")
        app.send(error)
        
    }
}
export {asyncHandler}