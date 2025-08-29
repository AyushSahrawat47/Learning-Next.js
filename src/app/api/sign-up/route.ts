import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import bcrypt from "bcryptjs";
import {errorResponse, successResponse} from '@/helpers/apiResponse'

import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, email, password } = await request.json();

    const existingUserVerifiedByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingUserVerifiedByUsername) {
        return errorResponse("Username already taken0", 400);
    //   return Response.json(
    //     {
    //       success: false,
    //       message: "Username already taken",
    //     },
    //     {
    //       status: 400,
    //     }
    //   );
    }

    const existingUserByEmail = await UserModel.findOne({ email });
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    if (existingUserByEmail) {
      if(existingUserByEmail.isVerified){
        return errorResponse("User already exists", 400)
        // return Response.json({
        //     success:false,
        //     message: "User already exists!"
        // }, {status: 400});
      }else{
        const hashedPassword = await bcrypt.hash(password,10);
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpiry = new Date(Date.now()+ 3600000)

        await existingUserByEmail.save();
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);

      const exipryDate = new Date();
      exipryDate.setHours(exipryDate.getHours() + 1);

      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry: exipryDate,
        isVerified: false,
        isAcceptingMessages: true,
        messages :[],
      });

      await newUser.save();

    }

    // Send Verification Email
    const emailResponse = await sendVerificationEmail(email, username, verifyCode)

    if(!emailResponse.success){
        return errorResponse(emailResponse.message)
        // return Response.json({
        //     success:false,
        //     message:emailResponse.message
        // }, {status:500})
    }

    return successResponse("registered successfully. Please verify your email", 201)
    // return Response.json({
    //     success:true,
    //     message: 'User registered successfully. Please verify your email'
    // }, {status:201})


  } catch (err) {
    console.error("Error registering user", err);
    return errorResponse('Error registering user')
    // return Response.json(
    //   {
    //     success: false,
    //     message: "Error registering user",
    //   },
    //   {
    //     status: 500,
    //   }
    // );
  }
}
