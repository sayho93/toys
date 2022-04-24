const CustomFieldShema = mongoose =>
    new mongoose.Schema(
        {
            field: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'CustomField',
            },
            name: String,
            value: String,
        },
        {_id: false, strict: false}
    )

export default CustomFieldShema
