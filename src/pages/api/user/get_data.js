import User from '../../../models/user'
import authenticate from '../../../middleware/authenticate'

const getUserData = async (req, res) => {

    if (req.method == 'GET') {

        const id = req.user.id

        try {
            const user = await User.findOne({ _id: id })

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

export default authenticate(getUserData, 'GET')