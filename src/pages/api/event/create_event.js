import Event from '../../../models/event'
import User from '../../../models/user'
import authenticate from '../../../middleware/authenticate'

const createEvent = async (req, res) => {
    if (req.method == 'POST') {
        const id = req.user.id
        if (!req.body.start || !req.body.end || !req.body.description) {
            return res.status(400).send("Missing event parameters")
        }
        try {
            const user = await User.findOne({ _id: id })
            if (!user) {
                return res.status(400).send('User not found')
            }
            const event = await Event.create({ ...req.body, user: user })
            return res.status(200).send(event)
        } catch (error) {
            return res.status(400).send(error)
        }
    } else {
        res.status(405).send('Request method not supported')
    }
}

export default authenticate(createEvent, 'POST')