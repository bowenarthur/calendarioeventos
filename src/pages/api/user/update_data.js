import User from '../../../models/user'
import authenticate from '../../../middleware/authenticate'

const updateData = async (req, res) => {

    if (req.method == 'PUT') {

        const { id } = req.user

        try {
            const user = await User.findByIdAndUpdate(id, req.body, { new: true })

            if (!user) {
                return res.status(400).send('Usuário não encontrado')
            }

            return res.status(200).send(user)

        } catch (error) {
            return res.status(400).send(error)
        }

    } else {
        res.status(405).send('Método de requisição não suportado')
    }
}

export default authenticate(updateData, 'PUT')