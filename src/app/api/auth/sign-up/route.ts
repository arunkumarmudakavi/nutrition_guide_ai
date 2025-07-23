import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/src/db/connection";
import User from "@/src/app/models/User.model";

export async function POST(request: NextRequest) {
    try {
        const {firstName, lastName, email, password} = await request.json();
        console.log(firstName, lastName, email, password)
        
        if(!firstName || !lastName || !email || !password) {
            return NextResponse.json(
                {error: "All are required"},
                {status: 400}
            )
        }

        await connectToDatabase();

        const existingUser = await User.findOne({email})

        if(existingUser) {
            return NextResponse.json(
                {error: "Email is already exist"},
                {status: 400}
            )
        }

        await User.create(
            {
                firstName,
                lastName,
                email,
                password
            }
        )

        return NextResponse.json(
            {message: "User created successfully"},
            {status: 201}
        )

    } catch (error) {
        return NextResponse.json(
            {error: "Failed to register user"},
            {status: 500}
        )
    }
}