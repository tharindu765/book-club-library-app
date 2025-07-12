import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { APIError } from "../errors/ApiError";

export const errorHandleer = (error:any, req:Request,res:Response,next:NextFunction) => {
    console.error(error)

    if(error instanceof mongoose.Error){
        res.status(400).json({massage:error.message})
        return
    }
    if(error instanceof APIError){
        res.status(error.status).json({massage:"An unexpected error occurred"})
    }

    res.status(500).json({massange:"Internal server error"})
}