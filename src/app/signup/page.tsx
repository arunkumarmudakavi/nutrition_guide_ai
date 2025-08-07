"use client"

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation"
import { useState } from "react";
import { useForm } from "react-hook-form";

const signUp = () => {
  const router = useRouter();
  const { register, handleSubmit } = useForm();
  const [error, setError] = useState("");

  const onSignUp = async (userData : Object) => {
    setError("")
    try {
      const response = await axios.post("/api/auth/sign-up", userData)
      console.log(response)
      router.push("/signin")
    } catch (error:any) {
      console.log("Error on signup", error)
      setError(error)
    }
  }

  return (
    <div className="flex flex-col min-h-96 m-16 rounded justify-center items-center shadow-2xl gray-background-color">
      <span className="text-5xl m-6 secondary-color font-semibold">Sign Up</span>
      <form className="flex flex-col mb-4" onSubmit={handleSubmit(onSignUp)}>
        <input className="border mb-2 rounded p-1 w-[40vw]" type="text" {...register("firstName", { required: true })} placeholder="Firstname" />
        <input className="border mb-2 rounded p-1 w-[40vw]" type="text" {...register("lastName", { required: true })} placeholder="Lastname" />
        <input className="border mb-2 rounded p-1 w-[40vw]" type="text" {...register("email", { required: true })} placeholder="Email"/>
        <input className="border mb-2 rounded p-1 w-[40vw]" type="text" {...register("password", { required: true })} placeholder="Password"/>
        <button className="border rounded p-1 font-semibold bg-black text-white">SIGN UP</button>
     </form>
     <section className="font-bold text-sm mb-6 text-blue-700">
        Don't have an account? <Link href="/signin" className="italic underline">Sign In</Link>
      </section>
      {error && <p className="font-bold italic text-red-800">{error}</p>}
     </div>
  )
}

export default signUp

