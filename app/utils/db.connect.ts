import mongoose from "mongoose"
import { configDotenv } from "dotenv"

configDotenv()

async function dbConnect() {
    if (mongoose.connections[0].readyState) {
        console.log("Already connected");
        return;
    }

    await mongoose.connect(process.env.MONGO_URI)
        .then(() => {
            console.log("Database connected successfully")
        })
        .catch((err) => {
            console.log("Error connecting to database", err)
        })
}

export default dbConnect