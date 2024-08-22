//have user get signed up and then login .. in both the cases token is generated and set as cookie . so jwt ,
import { Request,Response } from "express"
import prisma from "../prisma";
import jwt from 'jsonwebtoken'
export const signUp=async(req:Request,res:Response)=>{
    try{
        const {name,email,password}=req.body;
        const newUser=await prisma.user.create({
            data:{
                name,email,password
            }
        })
        if(newUser){
            //generate token and set the cookie
            const token =jwt.sign({id:newUser.id},process.env.JWT_SECRET||"secret")
            res.cookie('token',token)
            res.status(201).send({
                msg:"a user is created",
                user: newUser,
            })
        }else{
            res.send({
                msg:`there is some error there`
            })
        }
    }catch(err){
        console.log(err)
    }
} 
export const logIn =async(req:Request,res:Response)=>{
    try{
        const {email,password}=req.body;
        const found=await prisma.user.findUnique({
            where:{
                email
            }
        })
        if(found){
            //check if the password also matches >>
            const isPassMatched=password===found.password;
            const token =jwt.sign({id:found.id},process.env.JWT_SECRET||"secret")
            if(isPassMatched){
                res.cookie('token',token)
                res.status(200).send({
                    msg:`welcome back ${found.name}`,
                })
            }else{
                res.status(401).send({
                    msg:`the password didnt match`
                })
            }
        }else {
            res.status(401).send({
                msg:`there is no user with this email..try signing Up `
            })
        }
    }catch(err){
        console.log(err)
    }
}
export const getUsers=async(req:Request,res:Response)=>{
    try{
        const users=await prisma.user.findMany();

        if(users){
            res.status(200).send({
                users:users
            })
        }else{
            res.status(400).send({
                msg:`there is some error in fetching the users`
            })
        }
    }catch(err){
        console.log(err)
    }
}
export const getme=async(req:Request,res:Response)=>{
    try{    
        const token =req.cookies["token"];
        if(token){
            const decoded= jwt.verify(token,process.env.JWT_SECRET||"secret");
            const foundUser=await prisma.user.findUnique({
                where:{
                    //@ts-ignore
                    id:decoded.id
                },select:{
                    id:true,
                    name:true,
                    email:true
                }
            })
            res.json({
               id:foundUser?.id,
               token:token,
               name:foundUser?.name,
               email:foundUser?.email
            })
        }else{
            res.send({
                msg:`some error is there`
            })
        }
    }catch(err){
        console.log(err)
    }
}
export const getRooms=async(req:Request,res:Response)=>{
    try{
        const alltherooms=await prisma.room.findMany({
            select:{
                name:true,
                members:true
            }
        });
        if(alltherooms){
            res.status(200).send({
               alltherooms
            })
        }else{
            res.status(400).json({
                msg:`there is an error`
            })
        }
    }catch(err){
        console.log(err)
    }
} 
export const getRoom=async(req:Request,res:Response)=>{
    try{
        const id=req.params.id
        const theRoom=await prisma.room.findUnique({
            where:{
                id:Number(id)
            }
        })
        if(theRoom){
            res.status(200).send({
                theRoom
            })
        }else{
            res.json({
                status:400,
                msg:`the room with this not found`
            })
        }
    }catch(err){
        console.log(err)
    }
}