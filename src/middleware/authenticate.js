const jwt = require('jsonwebtoken')

const authenticate = (fn, method) => {
    return async (req, res) => {

        if (req.method !== method) {

            return res.status(405).send('Método de requisição não suportado')

        }

        const authHeader = req.headers.authorization

        if (!authHeader) {
            return res.status(401).send('Token de autorização não fornecido')
        }

        const parts = authHeader.split(' ')

        if (parts.length != 2) {
            return res.status(401).send('Formato do token incorreto')
        }

        const [scheme, token] = parts

        if (!/^Bearer$/i.test(scheme)) {
            return res.status(401).send('Token inválido')
        }

        await jwt.verify(token, process.env.JWT_HASH, (error, decoded) => {
            if (error) {
                return res.status(401).send('Token inválido')
            }

            req.user = {
                id: decoded.id,
            }
        })

        return fn(req, res)

    }

}

export default authenticate