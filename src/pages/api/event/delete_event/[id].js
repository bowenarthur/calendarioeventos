import Event from '../../../../models/event'
import authenticate from '../../../../middleware/authenticate'

const deleteEvent = async (req, res) => {

    if (req.method == 'DELETE') {

        const id = req.query.id

        try {
            const event = await Event.findByIdAndDelete(id)

            if (!event) {
                return res.status(400).send('Evento não encontrado')
            }

            return res.status(200).send(event)

        } catch (error) {
            return res.status(400).send(error)
        }

    } else {
        res.status(405).send('Método de requisição não suportado')
    }
}

export default authenticate(deleteEvent, 'DELETE')