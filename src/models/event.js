const mongoose = require('../../infrastructure/database/mongoose')

const EventSchema = new mongoose.Schema({
    description:{
        type: String,
        required:true
    },
    start:{
        type: Date,
        required:true
    },
    end:{
        type: Date,
        required:true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
})

export default mongoose.models.Event || mongoose.model('Event', EventSchema)