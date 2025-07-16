import { RunnableSequence } from "@langchain/core/runnables";
import { getRelevantDocs } from "../vector/vectorStore";
import { queryHF } from "../hfModel/llm";
import { NextResponse } from "next/server";

export const runGraph = async (disease: string) => {
    console.log("diesease", disease)
    const docs = await getRelevantDocs(disease);
    console.log("docs: ",docs)

    const sequence = RunnableSequence.from([
        async () => ({
            input: `User with ${disease}.`,
            context: docs.map(doc => doc?.pageContent).join("\n")
        }),
        async({input, context}) => {
            return queryHF(`Based on: \n${context}\n\n Explain personalized diet for: \n ${input}`)
        }
    ])

    const res = await sequence.invoke({});
    return NextResponse.json({ res })
}