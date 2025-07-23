import { NextRequest, NextResponse } from "next/server";
import { initializePdfQA } from "../utils/hfModel";
import path from "path";

export async function POST(request: NextRequest) {
    const desease  = await request.json()
    console.log(desease)
    console.log("Called chat api")
    const chain = await initializePdfQA({
      pdfDocument: path.join("src/app/api/chat/pdf/guide.pdf"),
      chunkSize: 500,
      chunkOverlap: 0,
      kDocuments: 1,
      temperature: 0,
    });
  
    
    const result = await chain.invoke({ input: `Tell me diet for ${desease.query} patient?` });
    // console.log(result.answer)
    return NextResponse.json({ answer: result.answer });
  }