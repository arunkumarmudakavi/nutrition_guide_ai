export type NutritionState = {
    input: string
    userProfile?: {
        age: number
        weight: number
        gender: string
        issue: string
    }
    context?: string
    plan?: string
}