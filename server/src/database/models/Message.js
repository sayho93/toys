const Message = mongoose => {
    const model = new mongoose.Schema(
        {
            roomId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'rooms',
            },
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
    return mongoose.model('Message', model)
}

export default Message
