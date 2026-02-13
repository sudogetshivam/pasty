class apiResponse{
    constructor(statusCode,data,message="Task completed sucessfull"){
        this.statusCode=statusCode
        this.data=data
        this.message=message
        this.success=true
    }
}
export {apiResponse}