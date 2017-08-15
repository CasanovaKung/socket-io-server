const express = require('express');
const router = express.Router();
const cors = require('cors');
const app = express();

var whitelist = [
    'http://127.0.0.1:3000',
    'http://localhost:3000',
]
var corsOptionsDelegate = function(req, callback) {
    var corsOptions;
    if (whitelist.indexOf(req.header('Origin')) !== -1) {
        corsOptions = {
            origin: true
        } // reflect (enable) the requested origin in the CORS response 
    } else {
        corsOptions = {
            origin: false
        } // disable CORS for this request 
    }
    callback(null, corsOptions) // callback expects two parameters: error and options 
}
// app.use(corsOptionsDelegate);
// app.options('*', cors())
app.options('*', cors())

router.get('/', (req, res) => {
    res.send({ response: 'I am alive' }).status(200);
});
router.get('/test', function (req, res, next) {
    console.log(req.header('Host'))
    res.json({msg: 'This is CORS-enabled for a whitelisted domain.'})
})

module.exports = router;