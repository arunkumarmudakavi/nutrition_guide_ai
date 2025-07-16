import { getRelevantDocs } from "../vector/vectorStore";

export const generatePrompt = async () => {
  const docs = await getRelevantDocs("Sugar");
  
  return `
You are a nutrition expert.

User Details:
// - Age: 
// - Weight: 
// - Height: 
// - Gender: 
// - Health Conditions: 
- Disease: "Sugar"

Context Knowledge:
${docs.filter(doc => doc !== null && doc !== undefined).map(doc => `- ${doc.pageContent}`).join("\n")}

Give a personalized diet plan with Indian food examples.
`;
};
