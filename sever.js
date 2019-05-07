var express = require('express');
var bodyParser = require('body-parser')
var fs = require('fs');
var multer = require('multer')

var createFolder = function(folder) {
    try {
        fs.accessSync(folder);
    } catch (e) {
        fs.mkdirSync(folder)
    }
}

var uploadFolder = './upload/';

createFolder(uploadFolder);

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, uploadFolder)
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname)
    }
})

var upload = multer({ storage: storage })
    // var upload = multer({ dest: 'uploads/' })

var app = express();
app.use(express.static('public'));
// app.set('views', './views')
app.set('view engine', 'ejs');

var indexRoutes = require('./routes/index')
var usersRoutes = require('./routes/user');

var jsonParser = bodyParser.json()

var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.use(bodyParser.json())

app.use('/', indexRoutes);
app.use('/user', usersRoutes)
    // app.get('/', urlencodedParser, function(req, res) {
    //     console.dir(req.query);
    //     res.send('home')
    // })

app.get('/form/:name', function(req, res) {
    // var form = fs.readFileSync('./form.html', { encoding: "utf8" });
    // res.send(form);
    // res.sendFile(__dirname + '/form.html')

    var person = req.params.name;
    var data = { age: 28, job: "programmer", hobbie: ['eating', 'fighting', 'fishing'] }
    res.render('form', { data: data })
})

app.get('/about', function(req, res) {
    res.render('about')
})


app.post('/upload', upload.single('logo'), function(req, res) {
    res.send({ ret_code: 0 })
})

app.get('/profile/:id/user/:name', function(req, res) {
    res.send('this is the id：' + req.params.id + ' name: ' + req.params.name);
})

app.listen(3000)
console.log('listening to port 3000');