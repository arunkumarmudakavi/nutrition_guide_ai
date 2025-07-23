import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/src/db/connection";
import User from "@/src/app/models/User.model";

const generateAccessAndRefreshTokens = async (userId:any) => {
      const user = await User.findById(userId);
      if(!user) throw new Error("User not found")
      const accessToken = user.generateAccessToken();
      const refreshToken = user.generateRefreshToken();
  
      user.refreshToken = refreshToken;
      await user.save({ validateBeforeSave: false });
  
      return {
        accessToken,
        refreshToken,
      };
  };

export async function POST(request: NextRequest) {
    try {
        const {email, password} = await request.json();
        console.log(email, password)
        
        if(!email || !password) {
            return NextResponse.json(
                {error: "All are required"},
                {status: 400}
            )
        }

        await connectToDatabase();

        const existingUser = await User.findOne({email})

        if(!existingUser) {
            return NextResponse.json(
                {error: "User doesn't exist"},
                {status: 404}
            )
        }

        const isPasswordValid = await existingUser.isPasswordCorrect(password);
        if(!isPasswordValid) {
            return NextResponse.json(
                {error: "Invalid password"},
                {status: 401}
            )
        }

        const { accessToken, refreshToken} = await generateAccessAndRefreshTokens(existingUser._id)

        const loggedInUser = await User.findById(existingUser._id).select("-password -refreshToken")

        const options = {
            httpOnly: true,
            secure: true,
        }

        const response = NextResponse.json(
            {message: "User logged in successfully", user: loggedInUser, success: true},
        )

        response.cookies.set("accessToken", accessToken, options)
        response.cookies.set("refreshToken", refreshToken, options)

        return response;

    } catch (error) {
        return NextResponse.json(
            {error: "Failed to register user"},
            {status: 500}
        )
    }
}