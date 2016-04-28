var analyzer = {

    process: function(html) {

        function parseDate(messageDate) {
            return messageDate.split(" at ").join(" "); 
        }

        var nameDateMap = {};
        var threadNameDateMap = {};
        var nameCount = {};
        var nameMessageMap = {};

        var elements = $(html);

        $(elements).find(".thread").each(function (i, e) {
            var messageName;
            var messageDate;

            var threadName = $($(e)[0].firstChild).text();
            threadNameDateMap[threadName] = {};

            $(e).children().each(function (ind, elem) {
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

                    if (!nameCount[messageName]) {
                        nameCount[messageName] = 0;
                    }

                    nameCount[messageName] += 1;
                    
                    if (!nameMessageMap[messageName]) {
                        nameMessageMap[messageName] = [];
                    }
                    
                    nameMessageMap[messageName].push(messageText);

                    if (!nameDateMap[messageName]) {
                        nameDateMap[messageName] = {};
                    }

                    if (!nameDateMap[messageName][messageDate]) {
                        nameDateMap[messageName][messageDate] = [];
                    }

                    if (nameDateMap[messageName][messageDate].indexOf(threadName) === -1) {
                        nameDateMap[messageName][messageDate].push(threadName);
                    }

                    if (!threadNameDateMap[threadName][messageDate]) {
                        threadNameDateMap[threadName][messageDate] = [];
                    }

                    threadNameDateMap[threadName][messageDate].unshift({name: messageName, message: messageText});
                }
            })
        });

        return {nameDateMap: nameDateMap, threadDateMap: threadNameDateMap, nameCount: nameCount, nameMessageMap: nameMessageMap}
    }
};

module.exports = analyzer;
