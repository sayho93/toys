import mongoose from 'mongoose'

const Message = new mongoose.Schema(
    {
        user: {
            id: Number,
            email: String,
            name: String,
        },
        content: String,
        createdAt: Date,
        updatedAt: Date,
    },
    {versionKey: false, timestamps: true}
)

export default mongoose.model('Message', Message)
