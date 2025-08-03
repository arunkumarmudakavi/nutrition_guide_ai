"use client";
import axios from "axios";
import { useEffect, useState } from "react";

export const Profile = () => {
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(true);
  const userp = async () => {
    const user = await axios.get("/api/profile");
    console.log("user: ", user?.statusText);
    setData(user?.data?.data);
    setLoading(false);
  };
  // console.log(data)

  useEffect(() => {
    userp();
  }, []);
  return (
    <div className="flex flex-col min-h-96 m-16 rounded justify-center items-center shadow-2xl gray-background-color font-sans">
      <section className="text-5xl m-4 secondary-color font-semibold">
        Profile
      </section>
      {!loading ? (
        <section className="flex flex-col gap-2 w-[50vw] shadow-2xl gray-background-color pl-6 ml-[8vw] font-semibold p-12 m-12">
          <label htmlFor="email">Email</label>
          <input
            className="border-2 rounded-xl p-2 cursor-not-allowed"
            type="text"
            value={data?.email}
            disabled
          />
          <label htmlFor="firstName">First Name</label>
          <input
            className="border-2 rounded-xl p-2 cursor-not-allowed"
            type="text"
            value={data?.firstName}
            disabled
          />
          <label htmlFor="lastName">Last Name</label>
          <input
            className="border-2 rounded-xl p-2 cursor-not-allowed"
            type="text"
            value={data?.lastName}
            disabled
          />
        </section>
      ) : (
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
      )}
    </div>
  );
};

export default Profile;
