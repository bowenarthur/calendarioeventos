const mongoose = require('../../infrastructure/database/mongoose')

const UserSchema = new mongoose.Schema({
    name: {
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        }
    },

    email: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true,
        select: false
    }

})

export default mongoose.models.User || mongoose.model('User', UserSchema)