import { getServerSession } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { errorResponse, successResponse } from "@/helpers/apiResponse";
import { authOptions } from "../auth/[...nextauth]/options";

export async function POST(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!session || !session.user) {
    return errorResponse("Not authenticated", 401);
  }

  const userId = user._id;
  const { acceptMessages } = await request.json();
  try {
    const updateUser = await UserModel.findByIdAndUpdate(
      userId,
      { isAcceptingMessages: acceptMessages },
      { new: true }
    );
    if (!updateUser) {
      return errorResponse(
        "Failed to update user status to accept message",
        401
      );
    }
    return successResponse("Message acceptance status updated successfully");
  } catch (err) {
    console.error("Failed to update user status to accept messages:", err);
    return errorResponse("Failed to update user status to accept message");
  }
}

export async function GET(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!session || !session.user) {
    return errorResponse("Not authenticated", 401);
  }

  const userId = user._id;
  try {
    const foundUser = await UserModel.findById(userId);
    if (!foundUser) {
      return errorResponse("user not found", 404);
    }
    return Response.json(
      {
        success: true,
        isAcceptingMessages: foundUser.isAcceptingMessages,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Failed to retrieve user status to accept message", err);
    return errorResponse("Failed to retrieve user status to accept message"); 
  }
}
