import User from '../../../models/user'
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const login = async (req, res) => {

    if (req.method == 'POST') {
        try {

            const { email, password } = req.body

            if (!password || !email) {
                return res.status(400).send('Missing auth parameters')
            }

            const user = await User.findOne({ email: email }).select('+password')

            if (!user) {
                return res.status(400).send('User not found')
            }

            bcrypt.compare(password, user.password, async function (err, result) {
                if (!err && result) {

                    //params to be forwarded through token
                    const params = { id: user._id }

                    return res.status(200).send({
                        token: generateToken(params),
                        firstName: user.name.firstName,
                    })

                } else {
                    res.status(405).send('Wrong email or password')
                }

            });
        } catch (e) {
            return res.status(400).send(e.message)
        }
    } else {
        return res.status(405).send('Request method not supported')
    }

}

export default login

function generateToken(params = {}) {
    return jwt.sign(params, process.env.JWT_HASH, {
        expiresIn: 3600
    })
}