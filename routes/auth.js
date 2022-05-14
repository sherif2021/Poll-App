const router = require('express').Router()
const { decryptText, encryptText, createToken } = require('../helper')
const user_model = require('../models/user_model')


router.post('/register', async (req, res, next) => {

    try {

        const { language } = req.headers

        const exist = await user_model.findOne({ email: req.body.email })

        if (exist) {
            return next(language == 'ur' ? 'ای میل پہلے ہی رجسٹرڈ ہے۔' : 'Email is already registered.')
        }
        req.body.password = encryptText(req.body.password)

        const object = new user_model(req.body)

        const result = await object.save()

        result._doc.token = createToken(result._doc._id, false)

        delete result._doc.password

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

router.post('/login', async (req, res, next) => {

    try {

        const { language } = req.headers

        if (!req.body.email || !req.body.password) return next('Bad Request')
        
        const user = await user_model.findOne({ email: req.body.email })

        if (!user) {
            return next(language == 'ur' ? 'ای میل موجود نہیں ہے۔' : 'The email is not Exist.')
        }

        if (decryptText(user._doc.password) == req.body.password) {

            user._doc.token = createToken(user._doc._id, false)

            delete user._doc.password

            res.json(
                {
                    'status': true,
                    'data': user
                }
            )

        } else {
            next(language == 'ur' ? 'ای میل یا پاس ورڈ غلط ہے۔' : 'Email or password is incorrect.')
        }
    }
    catch (e) {
        console.log(e)
        next(e)
    }
})

module.exports = router