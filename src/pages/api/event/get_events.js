import Event from '../../../models/event'
import User from '../../../models/user'
import authenticate from '../../../middleware/authenticate'

const getJobs = async (req, res) => {
    if(req.method == 'GET'){
        try{
            const id = req.user.id
            let events = await Event.find({user: id})
            .populate('user')
            
            return res.status(200).send(events)
        }catch (error) {
            return res.status(400).send(error)
        }
    }else{
        res.status(405).send('Request method not supported')
    }
}

export default authenticate(getJobs, 'GET')