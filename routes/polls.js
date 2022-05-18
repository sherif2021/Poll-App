const { verifyToken } = require('../helper')
const poll_model = require('../models/poll_model')
const { route } = require('./admin')

const router = require('express').Router()


router.get('/complete/:page', verifyToken, async (req, res) => {

    try {

        var pageInNumber = Number(req.params.page)

        if (!pageInNumber && pageInNumber < 1) pageInNumber = 1
        pageInNumber--

        const polls = await poll_model.find({ duration: { $lte: new Date().getTime() } }).sort({ createdAt: -1 }).skip(pageInNumber * 10).limit(10)
        
        
        res.json(
            {
                'status': true,
                'data': polls
            }
        )
    }
    catch (e) {
        console.log(e)
        next(e)
    }
})

router.get('/pending/:page', verifyToken, async (req, res) => {

    try {

        var pageInNumber = Number(req.params.page)

        if (!pageInNumber && pageInNumber < 1) pageInNumber = 1
        pageInNumber--

        const polls = await poll_model.find({
            duration: { $gte: new Date().getTime() }
        }).sort({ createdAt: -1 }).skip(pageInNumber * 10).limit(10)

        res.json(
            {
                'status': true,
                'data': polls
            }
        )
    }
    catch (e) {
        console.log(e)
        next(e)
    }
})
module.exports = router