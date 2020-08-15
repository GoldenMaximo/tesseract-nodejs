const express = require('express');
const upload = require('express-fileupload');
const to = require('await-to-js').default;
const Tesseract = require('tesseract.js');

const app = express();

app.use(upload());

const router = express.Router();

app.set('view engine', 'ejs');
app.set('views', 'views');

router.get('/', (req, res) => {
    res.render('home', {
        text: null
    });
});

router.post('/', async (req, res) => {
    const file = req.files.file;
    const fileName = file.name;
    let err;

    [err] = await to(file.mv(`./images/${fileName}`));
    [err, dataObj] = await to(Tesseract.recognize(
        `./images/${fileName}`,
        'eng',
        { logger: m => console.log(m) }
    ));

      console.log('like magic:', dataObj.data.text);

    res.render('home', {
        text: `ayo bruv check this out:  ${err ? err : dataObj.data.text}`
    });
});

app.use(router);

app.listen('3000');
