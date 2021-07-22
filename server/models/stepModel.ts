import mongoose, { Schema } from 'mongoose'

const stepSchema = new mongoose.Schema({
    name: {
        type: String
    },
    description: {
        type: String
    },
    next_step: {
        type: Schema.Types.ObjectId,
        ref: 'Step'
    }
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
})

export default mongoose.model('Step', stepSchema)