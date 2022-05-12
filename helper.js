const CryptoJS = require("crypto-js")
const jwt = require("jsonwebtoken")

const multer = require('multer');
const path = require('path');

const serverUrl = 'http://ajory.online:5555/'
//const serverUrl = 'http://192.168.1.6:3000/'

const encryptText = (text) => {
    return CryptoJS.AES.encrypt(text, process.env.CRYPTO_KEY).toString()
};

const decryptText = (text) => {
    return CryptoJS.AES.decrypt(text, process.env.CRYPTO_KEY).toString(CryptoJS.enc.Utf8)
};

const createToken = (id, isAdmin) => {

    return jwt.sign(
        {
            id,
            isAdmin,
        },
        process.env.JWT_KEY,
        { expiresIn: '1000d' },

    )
}

const verifyToken = (req, res, next) => {

    const token = req.headers.token
    if (token) {
        jwt.verify(token, process.env.JWT_KEY, (err, user) => {
            if (err) return res.sendStatus(401)
            req.user = user
            next()
        })
    } else {
        return res.status(401)

    }
}

const verifyTokenAndAuthorization = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.id === req.params.id || req.user.isAdmin) {
            next()
        } else {
            return res.sendStatus(401)
        }
    })
}

const verifyTokenAndAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.isAdmin) {
            next()
        } else {
            return res.sendStatus(401)
        }
    })
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/');
    },

    filename: function (req, file, cb) {


        const filePath = file.fieldname + '-' + Date.now() + path.extname(file.originalname)
        cb(null, filePath);
        if (!req.paths) req.paths = []
        req.paths.push({ url: serverUrl + filePath, ex: path.extname(file.originalname) })
    }
});

const upload = multer({ storage: storage })

module.exports = {
    encryptText, decryptText, createToken, verifyToken,
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin,
    upload,
}