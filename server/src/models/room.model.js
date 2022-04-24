const RoomModel = mongoose => {
    const Members = new mongoose.Schema(
        {
            id: Number,
            email: String,
            name: String,
        },
        {_id: false}
    )

    const model = new mongoose.Schema(
        {
            title: {
                type: String,
                required: true,
            },
            members: [Members],
        },
        {versionKey: false, timestamps: true}
    )
    return mongoose.model('Room', model)
}

export default RoomModel
