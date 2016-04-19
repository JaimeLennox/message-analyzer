var express = require('express');
var app = express();

var bodyParser = require('body-parser');

var index = require('./routes/index');

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended : false}));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use('/', index);

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


