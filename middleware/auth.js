const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt= require("jsonwebtoken");
const User= require("../models/userModel.js");

exports.isAuthenticated = catchAsyncErrors(async (req, res, next)=>{

    const {token}= req.cookies;

    if(!token)
    {
        return next(new ErrorHandler("Please Login To Access This Resource",401));
    }
     
    const decodedData= jwt.verify(token, process.env.JWT_Secret);
    
    req.user = await User.findById(decodedData.id );
    next();
});

exports.authoriseRoles = (...roles) =>{
   return(req,res,next)=>{
    if(!roles.includes(req.user.role))
    {
        return(
            next(
                new ErrorHandler(`${req.user.name} you are not allowed to access the resource`, 403)
            )
        )
    }

    next();
}
};