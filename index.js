var express = require('express');
var cors = require('cors');
require('dotenv').config()
const multer = require('multer'); // to handle file uploading

var app = express();

// There are some instances where you are unable to write to the server's filesystem (ex. Heroku's free tier). In that case memoryStorage is the way to go
// Store uploaded files only in memory as Buffer objects instead of to disk.
// Read this: https://github.com/expressjs/multer/issues/371
// As soon as you are done with the request, the memory will be freed (or rather, when the GC decides to cleanup, but that's usually almost straight away).
// HMMM: Do filesize limits work right: https://github.com/expressjs/multer/issues/344
const memoryStorage = multer.memoryStorage();
const upload = multer({
  // dest: './public/uploads/', 
  storage: memoryStorage,
  // 1024 = 1kb, 1024*1024=1Mb
  limits: { fileSize: 200 * 1024 } // Limit max size of uploaded file to save space/memory. User will get error if they try to do larger.
});

app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// upload.single: accepts a single file specified by a form input object with name='upfile'. 
// File metadata will be stored in req.file.
app.post('/api/fileanalyse', upload.single('upfile'), function (req, res) {
  // console.log(req.file);
  res.json({
    name: req.file.originalname,
    type: req.file.mimetype,
    size: req.file.size
  });
});


const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Your app is listening on port ' + port)
});
