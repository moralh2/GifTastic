$("button").on("click", function () {
    var emotion = $(this).attr("data-emotion");
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
    for (var i = 0; i < results.length; i++) {
        var gifDiv = $("<div>");
        gifDiv.addClass("col-sm-12")
        gifDiv.addClass("mt-3")
        gifDiv.addClass("mb-3")

        var rating = results[i].rating;
        var p = $("<p>").text("Rating: " + rating);

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

        gifDiv.prepend(p);
        gifDiv.prepend(emotionImage);

        $("#gif-me").prepend(gifDiv);
    }
}