$(document).ready(function () {
    loadGifButtons()
})

var topics = ["happy", "sad", "angry", "overwhelmed", "scared", "drunk", "tired", "stressed", "confused", "overworked", "lonely", "ashamed", "excited", "crazy", "amused", "impressed", "shocked", "sick", "annoyed", "pensive", "proud", "content", "bored", "worried"]
var pagination = 0

function callAPI(keyword) {
    var api_key = "dc6zaTOxFJmzC"
    var offset = pagination * 10
    var queryURL = "https://api.giphy.com/v1/gifs/search?q=" +
        keyword + "&api_key=" + api_key + "&offset=" + offset + "&limit=10";
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        console.log(response);
        handleResponse(response.data)
    })
}

function loadGifButtons() {
    var btnDiv = $("#gif-buttons")
    pagination = 0
    btnDiv.empty()
    for (var i in topics) {
        var btn = $("<button>").addClass("btn btn-outline-danger mr-2 mb-2").attr("data-emotion", topics[i]).text(topics[i])
        btn.on("click", function () {
            $("#gif-me").empty();
            var emotion = $(this).attr("data-emotion")
            pagination = 0
            callAPI(emotion)
            var loadMore = $("#load-more")
            loadMore.empty()
            var btn2 = $("<button>").addClass("btn btn-danger mt-2").text("load 10 more")
            btn2.on("click", function () {
                pagination++
                callAPI(emotion)
            })
            $("#load-more").append(btn2)
        })
        btnDiv.append(btn)
    }
}

$("#add-new-btn").on("click", function (event) {
    event.preventDefault();
    var newBtnVal = $("#new-btn-input").val().trim().toLowerCase()
    console.log(newBtnVal)
    if (topics.indexOf(newBtnVal) == -1) {
        topics.push(newBtnVal)
        $("#new-btn-input").val("")
        loadGifButtons()
    }
})

function handleResponse(results) {
    var wrapperWrapper = $("<div>").addClass("row")
    var wrapper = $("<div>").addClass("collapse show multi-collapse col-md-12 mb-4").attr('id', 'gifCollapseDiv' + pagination)
    for (var i = 0; i < results.length; i++) {
        data = {
            'title': results[i].title,
            'rating': results[i].rating,
            'username': results[i].username,
            'imported': results[i].import_datetime.substring(0, 10),
            'trending': results[i].trending_datetime.substring(0, 10),
            'source': results[i].source_tld
        }
        var dataRow = $("<div>").addClass("row mt-4 bgo")
        var dataDiv = createDataDiv(data)
        var gifDiv = $("<div>").addClass("col-lg-3 offset-lg-1 col-md-12 mb-3")
        var emotionImage = $("<img>").addClass("gif img-fluid rounded mx-auto d-block")
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
        wrapper.append(dataRow)
    }
    wrapperWrapper.append(wrapper)
    var collapsaBtn = $('<a>').addClass("btn btn-outline-primary btn-sm ml-2 mb-2")
    collapsaBtn.attr("data-toggle", "collapse")
    collapsaBtn.attr("href", "#gifCollapseDiv" + pagination)
    collapsaBtn.attr("role", "button")
    collapsaBtn.attr("aria-expanded", "false")
    var indeces = [String((pagination) * 10 + 1), String((pagination + 1) * 10)]
    console.log(indeces[0].length)
    console.log(indeces[1].length)
    if (indeces[0].length < indeces[1].length) {
        indeces[0] = "0" + indeces[0]
    }
    collapsaBtn.text("  " + indeces[0] + "-" + indeces[1])
    var collapseIcon1 = $("<i>").addClass("fas fa-caret-up")
    var collapseIcon2 = $("<i>").addClass("fas fa-caret-down")
    collapsaBtn.prepend(collapseIcon2).prepend(collapseIcon1)
    var collDiv = $('<div>').addClass("col-md-12 text-center")
    collDiv.append(collapsaBtn)
    wrapperWrapper.prepend(collDiv)
    $("#gif-me").prepend(wrapperWrapper);
}

function createDataDiv(data) {
    var dataDiv = $("<div>").addClass("col-lg-7 col-md-12")
    var tableDiv = $("<div>").addClass("table-responsive")
    var table = $("<table>").addClass("table table-sm table-dark table-bordered table-striped")
    var tbody = $("<tbody>")

    for (var key in data) {
        if (key != 'eurl' && key != 'slug') {
            var row = $("<tr>")
            var head = $("<th>").addClass("text-right").attr("scope", "row").text(key)
            var dataR = $("<td>").text(data[key])
            row.append(head).append(dataR)
            tbody.append(row)
        }
    }
    var row = $("<tr>")
    tbody.append(row)
    table.append(tbody)
    tableDiv.append(table)
    dataDiv.append(tableDiv)
    return dataDiv
}