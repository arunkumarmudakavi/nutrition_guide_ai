import { Runnable} from "@langchain/core/runnables"
import { NutritionState } from "../types/nutritionState"

export const getUserProfile: Runnable<NutritionState, NutritionState> = {
    invoke: async (state) => {
        return {
            ...state,
        }
    }
}

export const retriveContext: Runnable<NutritionState, NutritionState> = {
    invoke: async (state) => {
        const retriever = vectorStore.asRetriever()
        const question = `diet plan for ${state.userProfile?.issue}`
        const docs = await retriever.getRelevantDocuments(question)
        const context = docs.map(doc => doc.pageContent).join("\n")
        return { ...state, context}
    }
}