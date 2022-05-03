const MessageModel = ({DataSourceMongoDB}) => {
    const model = new DataSourceMongoDB.Schema(
        {
            roomId: {
                type: DataSourceMongoDB.Schema.Types.ObjectId,
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
    return DataSourceMongoDB.model('Message', model)
}

export default MessageModel
