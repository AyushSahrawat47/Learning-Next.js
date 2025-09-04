import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";
import {errorResponse, successResponse} from '@/helpers/apiResponse'

const UsernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function POST(request: Request) {
  await dbConnect();
  try{
    const {username,code} = await request.json()
    const decodedUsername = decodeURIComponent(username)
    const user = await UserModel.findOne({username:decodedUsername})
    if(!user) return errorResponse('User not found',404)

    const isCodeValid = user.verifyCode === code;
    const isCodeNotExpired =new Date(user.verifyCodeExpiry) > new Date();

    if(isCodeValid && isCodeNotExpired){
        user.isVerified = true;
        await user.save();
        return successResponse('Account verified successfully')
    }else if(!isCodeNotExpired){
        return errorResponse('Verification code has expired',400)
    }else{
        return errorResponse('Invalid verification code',400)
    }



  }catch(err){
    console.error('Error verifying user', err)
    return errorResponse('Error verifying user')
  }
}