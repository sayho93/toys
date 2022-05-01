const RoomModel = ({DataSourceMongoDB}) => {
    const Members = new DataSourceMongoDB.Schema(
        {
            id: Number,
            email: String,
            name: String,
        },
        {_id: false}
    )

    const model = new DataSourceMongoDB.Schema(
        {
            title: {
                type: String,
                required: true,
            },
            members: [Members],
        },
        {versionKey: false, timestamps: true}
    )
    return DataSourceMongoDB.model('Room', model)
}

export default RoomModel
