const express = require('express');
const app = express();
const path = require('path');
const http = require('http');
const port = 3002;

app.use(express.static(path.join(__dirname, 'assets')));
app.set('view engine', 'ejs');

const router = express.Router();

router.get('/', function (req, res) {
    res.sendFile(path.join(`${__dirname}/index.html`));
});

app.use('/', router);


app.listen(port);

console.log(`Running at port ${port}`);