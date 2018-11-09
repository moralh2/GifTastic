$("button").on("click", function () {
    var emotion = $(this).attr("data-emotion");
    // var api_key = "Xn6YqGd64F2yEYT65oUuwsZkVPMF0ocO"
    var queryURL = "https://api.giphy.com/v1/gifs/search?q=" +
        emotion + "&api_key=dc6zaTOxFJmzC&limit=10";
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
        var runningTitle = results[i].title
        if (runningTitle.length > 45) {
            runningTitle = runningTitle.substring(0,42) + '...'
        }
        data = {
            'rating': results[i].rating,
            'username': results[i].username,
            'title': runningTitle,
            'imported': results[i].import_datetime.substring(0,10),
            'trending': results[i].trending_datetime.substring(0,10)
        }
        var dataDiv = createDataDiv(data)
        var gifDiv = $("<div>");
        gifDiv.addClass("col-sm-6 mb-4")
        var emotionImage = $("<img>");
        emotionImage.addClass("gif")
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
        $("#gif-me").append(dataDiv);
        $("#gif-me").append(gifDiv);
    }
}

function createDataDiv(data) {
    var dataDiv = $("<div>")
    dataDiv.addClass("col-sm-4 offset-sm-2")

    var ratingDiv = $("<div>")
    ratingDiv.addClass("card text-white bg-secondary mb-1")
    createCardPieces(ratingDiv, [['rating', data.rating],['username', data.username]])

    var titleDiv = $("<div>")
    titleDiv.addClass("card text-white bg-primary mb-1")
    createCardPieces(titleDiv, [['title', data.title]])

    var dateDiv = $("<div>")
    dateDiv.addClass("card text-white bg-dark mb-1")
    createCardPieces(dateDiv, [['date imported', data.imported],['last trending', data.trending]])

    dataDiv.append(ratingDiv)
    dataDiv.append(titleDiv)
    dataDiv.append(dateDiv)

    return dataDiv

}

function createCardPieces(mainCard, attrs=[]) {
    if (attrs.length == 2) {

        var headerDiv = $("<div>")
        headerDiv.addClass("card-header")
        var row1 = $("<div>")
        row1.addClass("row")

        var headerDivLeft = $("<div>")
        headerDivLeft.addClass("col-sm-6")
        headerDivLeft.text(attrs[0][0])

        var headerDivRight = $("<div>")
        headerDivRight.addClass("col-sm-6 text-right")
        headerDivRight.text(attrs[1][0])

        row1.append(headerDivLeft)
        row1.append(headerDivRight)
        headerDiv.append(row1)


        var bodyDiv = $("<div>")
        bodyDiv.addClass("card-body")
        var row2 = $("<div>")
        row2.addClass("row")

        var bodyDivLeft = $("<div>")
        bodyDivLeft.addClass("col-sm-6 datetime")
        bodyDivLeft.text(attrs[0][1])

        var bodyDivRight = $("<div>")
        bodyDivRight.addClass("col-sm-6 text-right datetime")
        bodyDivRight.text(attrs[1][1])

        row2.append(bodyDivLeft)
        row2.append(bodyDivRight)
        bodyDiv.append(row2)

        mainCard.append(headerDiv)
        mainCard.append(bodyDiv)

    }
    else {

        var headerDiv = $("<div>")
        headerDiv.addClass("card-header text-right")
        headerDiv.text(attrs[0][0])
        var bodyDiv = $("<div>")
        bodyDiv.addClass("card-body")
        var pTag = $("<p>")
        pTag.addClass("card-text text-right text-uppercase")
        pTag.text(attrs[0][1])
        bodyDiv.prepend(pTag)
        mainCard.append(headerDiv)
        mainCard.append(bodyDiv)

    }
}