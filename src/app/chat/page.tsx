"use client";
import axios from "axios";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

const chat = () => {
  const { register, handleSubmit } = useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<any>({});

  const items = [
    {
      key: "bp",
      label: "Blood Pressure",
    },
    {
      key: "diabetes",
      label: "Diabetes",
    },
    {
      key: "obesity",
      label: "Obesity",
    },
    {
      key: "anemia",
      label: "Anemia",
    },
    {
      key: "hypothyroidism",
      label: "Hypothyroidism",
    },
    {
      key: "colesterol",
      label: "Colesterol",
    },
    {
      key: "acid_reflux",
      label: "Acid Reflux",
    },
    {
      key: "weak_immunity",
      label: "Weak Immunity",
    },
    {
      key: "constipation",
      label: "Constipation",
    },
    {
      key: "cough_and_cold",
      label: "Cough and Cold",
    },
  ];

  const [selectedValue, setSelectedValue] = useState("");

  const handleSelectionChange = (key: React.Key) => {
    setSelectedValue(String(key));
  };

  const sendChat = async (data: {}) => {
    if (data === "") return alert("Select Disease");
    console.log(data);
    setLoading(true);
    try {
      const response = await axios.post("/api/chat", data);
      console.log(response);
      if (response?.data?.answer.length > 0) {
        setLoading(false);
      }
      setData(response?.data);
    } catch (error: any) {
      console.log("Error on chat", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="m-4 flex flex-col font-sans">
      <span className="text-2xl font-bold m-4">Select Your Disease</span>
      <section>
        <form className="flex flex-col p-2" onSubmit={handleSubmit(sendChat)}>
          <select
            className="w-[20vw]"
            value={selectedValue}
            {...register("query", { required: true })}
            onChange={(e) => handleSelectionChange(e.target.value)}
          >
            {items?.map((item) => (
              <option
                key={item?.key}
                value={item?.key}
                className="font-semibold pb-2"
              >
                {item?.label}
              </option>
            ))}
          </select>
          <button
            className="border rounded px-2 w-[10vw] h-[4vh] font-semibold my-4"
            type="submit"
          >
            Generate
          </button>
        </form>

        {loading ? (
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
        ) : (
          <section className="m-[2rem]">
            <span className="m-2 font-semibold text-xl text-justify font-sans">
              {data?.answer}
            </span>
          </section>
        )}
      </section>
    </div>
  );
};

export default chat;
