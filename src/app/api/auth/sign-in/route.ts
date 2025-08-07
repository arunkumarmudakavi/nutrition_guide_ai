import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/src/db/connection";
import User from "@/src/app/models/User.model";
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
  try {
    const userData = await request.json();
    const { email, password } = userData;
    console.log(userData);
    await connectToDatabase();
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { error: "User doesn't exist" },
        { status: 400 }
      );
    }
    console.log("user exist");

    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    const tokenPayload = {
      id: user._id,
      username: user.username,
      email: user.email,
    };

    const token = await jwt.sign(
      tokenPayload,
      process.env.ACCESS_TOKEN_SECRET!,
      { expiresIn: "1d" }
    );

    const response = NextResponse.json({
      message: "Logged In Success",
      success: true,
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: true,
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error.message,
      },
      { status: 500 }
    );
  }
}
