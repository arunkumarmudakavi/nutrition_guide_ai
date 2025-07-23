"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

const signIn = () => {
  const { register, handleSubmit } = useForm();
  const router = useRouter();
  const [error, setError] = useState("");

  const login = async (userData: Object) => {
    setError("");
    try {
      const response = await axios.post("/api/auth/sign-in", userData);
      console.log(response);
      router.push("/signup");
    } catch (error: any) {
      console.log("Error on signup", error);
      setError(error);
    }
  };

  return (
    <div className="flex flex-col min-h-96 m-16 rounded justify-center items-center shadow-2xl gray-background-color">
      <span className="text-5xl m-6 secondary-color font-semibold">
        Sign In
      </span>
      <form className="flex flex-col mb-4" onSubmit={handleSubmit(login)}>
        <input
          className="border mb-2 rounded p-1 w-[40vw]"
          type="text"
          {...register("email", { required: true })}
          placeholder="Email"
        />
        <input
          className="border mb-2 rounded p-1 w-[40vw]"
          type="text"
          {...register("password", { required: true })}
          placeholder="Password"
        />
        <button className="border rounded p-1 font-semibold bg-black text-white">
          SIGN IN
        </button>
      </form>
      <section className="font-bold text-sm mb-6 text-blue-700">
        Don't have an account? <span className="italic underline">Sign Up</span>
      </section>
      {error && <p className="font-bold italic text-red-800">{error}</p>}
    </div>
  );
};

export default signIn;
