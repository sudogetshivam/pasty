class apiError extends Error{
    constructor(
        statusCode,//In construtctor we pass parameters like doing new apierror(statuscode(this is compulsory))
        message="Something is going wrong",
        errors=[],
        stack=""
    ){
        super(message)
        /*

        super(message) sets the Error class message, this.message=message, here the 
        catching part is this.message=message which you have written down is an redundant 
        part because due to help of super(message) this.message=message is already, so you can
        skip


        once check the apiResponse.js file there you will get something more and extracted --- i hope you will be able to recall

        */      
        this.statusCode=statusCode
        this.data=null
        this.success=false      //setting up variables
        this.message=message
        this.errors=errors

        if(stack){
            this.stack=stack // if stack parameter is given then set it
        }
        else{
            Error.captureStackTrace(this,this.constructor) 
             /* this is special function by nodejs here 'this' the first parameter
             is the target, where at which place or while creating which controller/instance
             we got error, that trace will get printed or seen in console log also 'this.constructor'
             is our boundry function where we are not seeing the error inside apierror, so the constrctor erros
             are getting ignored(and how would a constrctor throw error for now, think yourself)*/
        }
    }
}

export {apiError}