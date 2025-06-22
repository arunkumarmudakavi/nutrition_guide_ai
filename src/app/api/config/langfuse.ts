import { CallbackHandler } from "langfuse-langchain"

export const callbackHandler = new CallbackHandler({
    publicKey: process.env.LANGFUSE_PUBLIC_KEY!,
    secretKey: process.env.LANGFUSE_SECRET_KEY!,
    baseUrl: process.env.LANGFUSE_HOST! || "https://cloud.langfuse.com"
})