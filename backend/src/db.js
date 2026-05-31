import mongoose from 'mongoose'
const Pizza_app_DB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Conned to DB")
    } catch (err) {
        console.log("Failed to connect " + err)
     }
}

Pizza_app_DB()

export default Pizza_app_DB