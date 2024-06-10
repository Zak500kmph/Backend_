class ApiError extends Error{
    constructor(
        message="Errror is occured",
        statusCode
    ){
     super(message)
     this.message=message
     this.statusCode=statusCode
    }
}
export {ApiError}