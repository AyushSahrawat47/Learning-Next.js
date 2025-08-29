export function errorResponse(message:any, status:number = 500){
    return Response.json({
        success:false,
        message
    }, {status});
};

export function successResponse(message:string, status:number = 200){
    return Response.json({
        success: true,
        message
    }, {status});
};