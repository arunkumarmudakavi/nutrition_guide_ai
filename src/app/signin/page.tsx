"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";

interface LoginFormData {
  email: string;
  password: string;
}

const signin = () => {
  const { register, handleSubmit } = useForm<LoginFormData>();
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const [error, setError] = useState("");

  const login = async (data: LoginFormData) => {
    setError("");
    setLoading(true)
    // console.log(userData)
    try {
      const response = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password
      })
      
      // console.log(response);
      if(response?.ok) {
        setLoading(false)
        router.push("/");
        console.log("Sign in successful");
      } else {
        setError("Invalid credentials");
        setLoading(false);
      }
    } catch (error: any) {
      console.log("Error on signup", error);
      setError("An error occurred during sign in");
      setLoading(false);
    }
  };

  {
    loading && (
      <div
            id="loading-overlay"
            className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-60"
          >
            <svg
              className="animate-spin h-8 w-8 text-black mr-3"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>

            <span className="text-white text-3xl font-bold">Loading...</span>
          </div>
    )
  }

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
        <button className="border rounded p-1 font-semibold bg-black text-white cursor-pointer">
          SIGN IN
        </button>
      </form>
      <section className="font-bold text-sm mb-6 text-blue-700">
        Don't have an account? <Link href="/signup" className="italic underline cursor-pointer">Sign Up</Link>
      </section>
      {error && <p className="font-bold italic text-red-800">{error}</p>}
    </div>
  );
};

export default signin;
