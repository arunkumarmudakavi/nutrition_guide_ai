import axios from "axios";

// export const huggingFaceModel = async (prompt: string) => {
//   try {
//     const response = await axios.post(
//       `${process.env.HF_MODEL}`,
//       { inputs: prompt },
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.HF_API_KEY}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     return response.data || "No response from model";
//   } catch (error) {
//     console.error("Error in huggingFaceModel:", error);
//     throw error;
//   }
// };

// app/utils/pdfQa.ts
import { HuggingFaceInference } from "@langchain/community/llms/hf";
import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import path from "node:path";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { createRetrievalChain } from "langchain/chains/retrieval";

interface PdfQAConfig {
  pdfDocument: string;
  chunkSize: number;
  chunkOverlap: number;
  searchType?: "similarity" | "mmr";
  kDocuments: number;
  temperature?: number;
  hfApiKey: string;
}

export async function initializePdfQA({
  pdfDocument,
  chunkSize,
  chunkOverlap,
  searchType = "similarity",
  kDocuments,
  temperature = 0.8,
  hfApiKey,
}: PdfQAConfig) {
  console.log("🔧 Initializing PDF QA system...");

  // 1. Load Hugging Face LLM
  const llm = new HuggingFaceInference({
    apiKey: hfApiKey,
    model: process.env.HF_MODEL!, // Change to any hosted Hugging Face model
    temperature,
  });

  // 2. Load PDF
  const pdfLoader = new PDFLoader(path.join(process.cwd(), pdfDocument));
  const documents = await pdfLoader.load();

  // 3. Split
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize,
    chunkOverlap,
  });
  const texts = await splitter.splitDocuments(documents);

  // 4. Embeddings
  const embeddings = new HuggingFaceInferenceEmbeddings({
    apiKey: hfApiKey,
    model: process.env.EMB_URL!,
  });

  const vectorStore = await MemoryVectorStore.fromDocuments(texts, embeddings);

  // 5. Retriever
  const retriever = vectorStore.asRetriever({
    k: kDocuments,
    searchType,
  });

  // 6. Prompt + Chain
  const prompt = ChatPromptTemplate.fromTemplate(
    `Answer the user's question: {input} based on the following context {context}`
  );

  const combineDocsChain = await createStuffDocumentsChain({
    llm,
    prompt,
  });

  const chain = await createRetrievalChain({
    combineDocsChain,
    retriever,
  });

  console.log("✅ Hugging Face QA Chain ready");
  return chain;
}
