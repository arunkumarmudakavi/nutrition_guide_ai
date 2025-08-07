"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import React from "react";

const Navbar = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  console.log(session, status);

  const handleLogout = async () => {
    try {
      const response = await signOut({
        callbackUrl: "/signin",
        redirect: true,
      });
      console.log(response);
    } catch (error: any) {
      console.log("Logout failed", error);
    }
  };
  return (
    <nav className="primary-background-color shadow-2xl flex justify-around pt-6 pb-6 white-color">
      <div className="caret-violet-50 text-4xl italic font-extrabold">
        <Link href="/">Nutrition AI</Link>
      </div>
      {status === "authenticated" && session && (
        <ul className="flex items-center cursor-pointer">
          <li className="mr-4 font-semibold">
            <Link href="/profile">Profile</Link>
          </li>
          <li className="mr-4 font-semibold">
            <Link href="/chat">Generate</Link>
          </li>
          <li className="mr-4 font-semibold">
            <button onClick={() => handleLogout()}>Logout</button>
          </li>
        </ul>
      )}{" "}
      {status === "unauthenticated" && (
        <ul className="flex items-center cursor-pointer">
          <li className="mr-4 font-semibold">
            <Link href="/signup">SignUp</Link>
          </li>
          <li className="mr-4 font-semibold">
            <Link href="/signin">SignIn</Link>
          </li>
        </ul>
      )}
    </nav>
  );
};

export default Navbar;
