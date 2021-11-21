import User from '../../../models/user'
const bcrypt = require('bcrypt')

export default async function signup(req, res) {

    if (req.method == 'POST') {

        const { name, email, password } = req.body

        try {

            if (!name || !password || !email) {
                return res.status(400).send('Dados de cadastro incompletos')
            }

            if (await User.findOne({ email: email })) {
                return res.status(400).send('E-mail já está sendo usado')
            }

            bcrypt.hash(password, 12, async function (err, hash) {
                // Store hash in your password DB.
                const user = await User.create({ ...req.body, password: hash })

                return res.status(200).send('Sucesso')
            });

        } catch (e) {
            return res.status(400).send(e)
        }

    } else {
        return res.status(405).send('Método de requisição não suportado')
    }

}