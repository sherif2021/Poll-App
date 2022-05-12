const router = require('express').Router()
const user_model = require('../models/user_model')
const { verifyToken, upload } = require("../helper")


router.get('/', verifyToken, async (req, res, next) => {

    try {
        const user = await user_model.findById(req.user.id)

        if (!user) return next('User Not Exist')

        delete user._doc.password

        res.json(
            {
                'status': true,
                'data': user
            }
        )
    }
    catch (e) {
        console.log(e)
        next(e)
    }
})


router.post('/', verifyToken, upload.array('picture'), async (req, res, next) => {

    try {

        if (req.paths && req.paths[0].ex == '.jpg')
            req.body.picture = req.paths[0].url

        delete req.body.password

        const user = await user_model.findOneAndUpdate({ _id: req.user.id }, req.body, { returnOriginal: false })

        if (!user) return next('User Not Exist')

        delete user._doc.password

        res.json(
            {
                'status': true,
                'data': user
            }
        )
    }
    catch (e) {
        console.log(e)
        next(e)
    }
})
module.exports = router