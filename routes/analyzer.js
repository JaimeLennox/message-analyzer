var express = require('express');
var router = express.Router();
var $ = require('jquery')(require("jsdom").jsdom().parentWindow);
var fs = require('fs');
var multer = require("multer");
var upload = multer({ dest: 'uploads/' });

router.post('/', upload.single("html"), function(request, response) {
    response.render('pages/analyzer', {
        filePath: request.file.path
    });
});

router.get('/data', function(request, response) {
    var htmlFile = __dirname + "/../" + request.query.file;

    fs.readFile(htmlFile, 'utf-8', function(err, html) {
        fs.unlink(htmlFile);
        var data = process(html);
        response.send(JSON.stringify(data));
    });
});

module.exports = router;

function process(html) {

    function parseDate(messageDate) {
        var splitDate = messageDate.split(",");
        var year = splitDate[2].substring(0, 5);
        return splitDate[1].substring(1, splitDate[1].length) + "," + year;
    }

    var nameDateMap = {};
    var elements = $(html);

    $(elements).find(".thread").each(function(i, e) {
        var messageName;
        var messageDate;

        $(e).children().each(function(ind, elem) {
            var current = $(elem);

            if (ind % 2 === 0) {
                // meta
                var children = $(current.children()[0]).children();
                messageName = $(children[0]).text();
                var dateText = $(children[1]).text();
                var parsedDate = parseDate(dateText);
                messageDate = new Date(parsedDate);
            } else {
                // message
                var messageText = current.text();

                if (!nameDateMap[messageName]) {
                    nameDateMap[messageName] = {};
                }

                if (!nameDateMap[messageName][messageDate]) {
                    nameDateMap[messageName][messageDate] = [];
                }

                nameDateMap[messageName][messageDate].push(messageText);
            }
        })
    });

    var nameCount = {};

    for (name in nameDateMap) {
        for (nameDate in nameDateMap[name]) {
            if (!nameCount[name]) nameCount[name] = 0;
            nameCount[name] += nameDateMap[name][nameDate].length;
        }
    }

    return {nameDateMap: nameDateMap, nameCount: nameCount}
}
