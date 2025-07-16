import axios from "axios"

const model_id = "sentence-transformers/all-MiniLM-L6-v2"

// Converting user input into vector embeddings. Ex: geek = [0.21, -0.24, etc...]
async function generateVector(disease: string) {
    const response = await axios.post(
        `${process.env.EMB_URL}/${model_id}`,
        {inputs: disease},
        {
            headers: {
                Authorization: `Bearer ${process.env.HF_API_KEY}`
            }
        }
    )
    return response.data[0]
}

export {generateVector}