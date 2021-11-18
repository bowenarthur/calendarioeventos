const jwt = require('jsonwebtoken')

const authenticate = (fn, method) => {
    return async (req, res) => {

        if (req.method !== method) {

            return res.status(405).send('Request method not supported')

        }

        const authHeader = req.headers.authorization

        if (!authHeader) {
            return res.status(401).send('authorization token not provided')
        }

        const parts = authHeader.split(' ')

        if (parts.length != 2) {
            return res.status(401).send('malformatted token')
        }

        const [scheme, token] = parts

        if (!/^Bearer$/i.test(scheme)) {
            return res.status(401).send('invalid token')
        }

        await jwt.verify(token, process.env.JWT_HASH, (error, decoded) => {
            if (error) {
                return res.status(401).send('invalid token')
            }

            req.user = {
                id: decoded.id,
            }
        })

        return fn(req, res)

    }

}

export default authenticate