import { NextRequest, NextResponse } from "next/server";
// import { runGraph } from "../graphs/generatePlanNode";

// export async function POST(request:NextRequest) {
//     try {
//         const body = await request.json();
//         const { query } = body;
//         console.log(query)

//         if (!query) throw NextResponse.json(
//             {error: "Empty query"},
//             {status: 400}
//         )

//         const res = await runGraph(query)
//         console.log(res)
//         return NextResponse.json(
//             {message: "Successss"},
//             {status: 201}
//         )
        
        
//     } catch (error) {
//         return NextResponse.json(
//             {error: "Error"},
//             {status: 500}
//         )
//     }
// }

import { initializePdfQA } from "../utils/hfModel";
import path from "path";

export async function POST(request: NextRequest) {
    console.log(request.body)
    console.log("Called chat api")
    const chain = await initializePdfQA({
      pdfDocument: path.join("src/app/api/chat/pdf/guide.pdf"),
      chunkSize: 500,
      chunkOverlap: 0,
      kDocuments: 5,
      temperature: 0,
      hfApiKey: process.env.HF_API_KEY!, // Set this in `.env.local`
    });
  
    console.log("45");
    
    const result = await chain.invoke({ input: "Tell me diet for sugar patient?" });
  console.log(result)
    return NextResponse.json({ answer: result.answer });
  }