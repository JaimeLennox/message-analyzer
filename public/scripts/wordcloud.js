var WordCloud = require('./wordcloud2.js');

var wordcloud = {
    create: function(words) {
        freq = {};

        words.forEach(function(word) {
            if (!freq[word]) {
                freq[word] = 0;
            }
            freq[word]++;
        });

        console.log(freq);

        list = [];
        $.each(freq, function(key, value) {
            list.push([key, value]);
        });

        $("#wordcloud").html("");

        var canvas = document.createElement('canvas');
        $("#wordcloud").append(canvas);

        WordCloud(canvas, { list: list });
    }
};

module.exports = wordcloud;
