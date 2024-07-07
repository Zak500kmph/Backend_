class Api_res{
    constructor(
        statusCode
        ,data
        ,message
    ){
        this.statusCode=statusCode,
        this.data=data,
        this.message=message,
        this.success=statusCode<400

    }
}
export {Api_res}