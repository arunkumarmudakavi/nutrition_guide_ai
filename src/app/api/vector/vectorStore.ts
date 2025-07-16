import { QdrantClient } from "@qdrant/js-client-rest";
import { generateVector } from "../embeddings/embeddings";

const client = new QdrantClient({
  url: process.env.QD_URL!,
  apiKey: process.env.QD_API!,
});

export async function getRelevantDocs(disease: string) {
  const c = await client.getCollections();
  console.log(c)
  const docs = await client.search("nutrition-collection", {
    vector: await generateVector(disease),
    limit: 3,
  });
  console.log(docs)
  // return docs
  return docs.map((item) => item.payload);
}
