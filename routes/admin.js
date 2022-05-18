const router = require('express').Router()
const { verifyTokenAndAdmin, createToken } = require('../helper')
const poll_model = require('../models/poll_model')
const user_model = require('../models/user_model')

router.post('/login', async (req, res, next) => {

    try {

        const { language } = req.headers

        const { username, password } = req.body

        if (!username || !password) return next('Bad Request')

        if (username == process.env.ADMIN_USERNAME && password == process.env.ADMIN_PASSWORD) {

            res.json(
                {
                    'status': true,
                    'data': createToken('admin', true)
                }
            )

        } else {
            next(language == 'ur' ? 'صارف نام یا پاس ورڈ غلط ہے۔' : 'Username or password is incorrect.')
        }
    }
    catch (e) {
        console.log(e)
        next(e)
    }
})

router.post('/poll', verifyTokenAndAdmin, async (req, res, next) => {

    try {
        req.body.duration = new Date().getTime() + (req.body.duration * 1000 * 60 * 60)
        const object = new poll_model(req.body)
        
        const result = await object.save()

        res.json(
            {
                'status': true,
                'data': result
            }
        )
    }
    catch (e) {
        console.log(e)
        next(e)
    }
})

module.exports = router