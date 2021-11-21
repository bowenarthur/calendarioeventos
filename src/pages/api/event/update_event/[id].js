import Event from '../../../../models/event'
import authenticate from '../../../../middleware/authenticate'

const updateEvent = async (req, res) => {

    if (req.method == 'PUT') {

        const id = req.query.id

        try {
            if (!req.body.start || !req.body.end || !req.body.description) {
                return res.status(400).send("Parâmetros de evento incompletos")
            }

            const event = await Event.findByIdAndUpdate(id, req.body, { new: true })

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

export default authenticate(updateEvent, 'PUT')