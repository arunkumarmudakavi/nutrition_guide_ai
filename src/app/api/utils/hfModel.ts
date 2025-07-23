import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import path from "node:path";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { Ollama, OllamaEmbeddings } from "@langchain/ollama";

interface PdfQAConfig {
  pdfDocument: string;
  chunkSize: number;
  chunkOverlap: number;
  searchType?: "similarity" | "mmr";
  kDocuments: number;
  temperature?: number;
}

export async function initializePdfQA({
  pdfDocument,
  chunkSize,
  chunkOverlap,
  searchType = "similarity",
  kDocuments,
}: PdfQAConfig) {
  console.log("🔧 Initializing PDF QA system...");

  const llm = new Ollama({
    model: "phi:2.7b",
    temperature: 0
  })

  const pdfLoader = new PDFLoader(path.join(process.cwd(), pdfDocument));
  const documents = await pdfLoader.load();

  // 3. Split
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize,
    chunkOverlap,
  });
  const texts = await splitter.splitDocuments(documents);
  // console.log("texts: ",texts)


  const embeddings = new OllamaEmbeddings({
    model: "mxbai-embed-large",
    baseUrl: "http://localhost:11434"
  })
  // console.log("embeddings: ",embeddings)

  const vectorStore = await MemoryVectorStore.fromDocuments(texts, embeddings);
  // console.log("vectorstore: ", vectorStore.embeddings)

  // 5. Retriever
  const retriever = vectorStore.asRetriever({
    k: kDocuments,
    searchType,
  });
  // console.log("retriever: ", retriever)

  // 6. Prompt + Chain
  const prompt = ChatPromptTemplate.fromTemplate(
    `Answer the user's question: {input} based on the following context {context}`
  );

  const combineDocsChain = await createStuffDocumentsChain({
    llm,
    prompt,
  });
  // console.log("combineDocsChain: ", combineDocsChain)

  const chain = await createRetrievalChain({
    combineDocsChain,
    retriever,
  });

  console.log("Hugging Face QA Chain ready");
  return chain;
}
