var analyzer = require('./analyzer.js');

$(function() {
    var nameDateMap;
    var threadDateMap;
    var nameCount;

    var name = $("#name");
    var retry = $("#retry");

    retry.hide();
    $("#analysis").hide();

    retry.on("click", function(e) {
        $("#analysis").hide();
        $("#datepicker").datepicker("destroy");
        $("#retry").hide();
        $("#browse").show();
    });

    name.on("change", function(e) {
        var nameVal = $("#name").val();
        var datePicker = $("#datepicker");
        var tables = $("#tables");

        datePicker.datepicker("destroy");
        tables.html("");

        datePicker.datepicker({
            oldDateText: "",
            beforeShowDay: function(date) {
                if (nameDateMap[nameVal][date])
                    return [true, 'event', ''];
                else
                    return [true, '', ''];
            },
            onSelect: function(dateText, inst) {
                var tables = $("#tables");

                if (this.oldDateText === dateText && tables.is(":visible")) {
                    tables.hide();
                } else {
                    tables.show();
                }

                this.oldDateText = dateText;

                tables.html("");

                var currentDate = new Date(dateText);
                var threadNames = nameDateMap[nameVal][currentDate];

                threadNames.filter(function(threadName) {
                    return ~threadName.indexOf(nameVal);
                });

                threadNames.forEach(function(threadName) {
                    var messageObjects = threadDateMap[threadName][currentDate];

                    var table = $("<br /><table class=\"table\"><th colspan=\"2\">" + threadName + "</th></table>");

                    messageObjects.slice().forEach(function(messageObject) {
                        table.append($("<tr><td>" + messageObject.name + "</td><td>" + messageObject.message + "</td></tr>"));
                    });

                    tables.append(table);
                });

            }
        });


    });

    $('#fileinput').change(function() {
        $("#browse").hide();
        retry.show();
        retry.text("Loading...");

        var htmlFile = $('#fileinput')[0].files[0];

        var reader = new FileReader();

        reader.onload = function(event) {
            var data = analyzer.process(event.target.result);

            nameDateMap = data.nameDateMap;
            threadDateMap = data.threadDateMap;
            nameCount = data.nameCount;

            var names = Object.keys(nameCount).sort(function(a, b) {
                return nameCount[b] - nameCount[a];
            });

            $.each(names, function(a, b) {
                name.append($("<option/>").attr("value", b).text(b +
                    " (" + nameCount[b] + ")"));
            });

            retry.text("Reset!");
            name.show();
            $("#analysis").show();
            name.change();
        };

        reader.readAsText(htmlFile);

        $(this).val("");
    });
});
