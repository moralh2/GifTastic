$("button").on("click", function () {
    var emotion = $(this).attr("data-emotion");
    var api_key = "Xn6YqGd64F2yEYT65oUuwsZkVPMF0ocO"
    // var api_key = "dc6zaTOxFJmzC"
    var queryURL = "https://api.giphy.com/v1/gifs/search?q=" +
        emotion + "&api_key=" + api_key + "&limit=10";
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        console.log(response);
        handleResponse(response.data)
    })
})

function handleResponse(results) {
    $("#gif-me").empty();
    for (var i = 0; i < results.length; i++) {
        data = {
            'title': results[i].title,
            'rating': results[i].rating,
            'username': results[i].username,
            'imported': results[i].import_datetime.substring(0,10),
            'trending': results[i].trending_datetime.substring(0,10),
            'source': results[i].source_tld
        }
        var dataRow = $("<div>").addClass("row mt-4")
        // dataRow.addClass("row mt-4")
        var dataDiv = createDataDiv(data)
        var gifDiv = $("<div>").addClass("col-lg-3 offset-lg-1 col-md-12 mb-3")
        // gifDiv.addClass("col-lg-3 offset-lg-1 col-md-12 mb-3")
        var emotionImage = $("<img>").addClass("gif img-fluid rounded mx-auto d-block")
        // emotionImage.addClass("gif img-fluid rounded mx-auto d-block")
        emotionImage.attr("src", results[i].images.fixed_height_still.url);
        emotionImage.attr("data-still", results[i].images.fixed_height_still.url);
        emotionImage.attr("data-animate", results[i].images.fixed_height.url);
        emotionImage.attr("data-state", 'still');

        emotionImage.on("click", function () {
            var state = $(this).attr("data-state");
            if (state === "still") {
                $(this).attr("src", $(this).attr("data-animate"));
                $(this).attr("data-state", "animate");
            } else {
                $(this).attr("src", $(this).attr("data-still"));
                $(this).attr("data-state", "still");
            }
        });
        gifDiv.prepend(emotionImage);
        dataRow.append(gifDiv);
        dataRow.append(dataDiv);
        $("#gif-me").append(dataRow);
    }
}

function createDataDiv(data) {
    var dataDiv = $("<div>").addClass("col-lg-7 col-md-12")
    // dataDiv.addClass("col-lg-7 col-md-12")
    var tableDiv = $("<div>").addClass("table-responsive")
    // dataDiv.addClass("table-responsive")
    var table = $("<table>").addClass("table table-sm table-dark table-bordered table-striped")
    // table.addClass("table table-sm table-dark table-bordered table-striped")
    var tbody = $("<tbody>")

    for (var key in data) {
        var row = $("<tr>")
        var head = $("<th>").addClass("text-right").attr("scope", "row").text(key)
        // head.addClass("text-right")
        // head.attr("scope", "row")
        // head.text(key)
        row.append(head)
        var dataR = $("<td>").text(data[key])
        // dataR.text(data[key])
        row.append(dataR)
        tbody.append(row)
    }
    table.append(tbody)
    tableDiv.append(table)
    dataDiv.append(tableDiv)
    return dataDiv
}