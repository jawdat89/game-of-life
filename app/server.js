const express = require('express');
const app = express();
const path = require('path');
const http = require('http');
const port = 3001;

app.use(express.static(path.join(__dirname, 'assets')));
app.set('view engine', 'ejs');

const router = express.Router();

router.get('/', function (req, res) {
    res.sendFile(path.join(`${__dirname}/index.html`));
});

// app.get('/', function (req, res) {

//     res.render('screens/index');
// });

app.use('/', router);


app.listen(process.env.port || 3001);

console.log('Running at port 3001');