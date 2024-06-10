class Api_res{
    constructor(
        statusCode
        ,body
        ,message
    ){
        this.statusCode=statusCode,
        this.body=body,
        this.message=message,
        this.success=statusCode<400

    }
}