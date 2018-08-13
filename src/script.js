// Example from:
// https://docs.microsoft.com/en-us/sharepoint/dev/general-development/how-to-follow-documents-sites-and-tags-by-using-the-rest-service-in-sharepoint-2#code-example-get-followed-content-by-using-the-sharepoint-rest-service

var followingManagerEndpoint;
var followedCount;

// Get the SPAppWebUrl parameter from the query string and build
// the following manager endpoint.
$(document).ready(function () {

    // container test
    var testContainer = document.getElementById("test");
    testContainer.innerHTML = "Some content from the script.js file";

    // var appweburl;
    var appweburl = "https://kksandbox.sharepoint.com/sites/intra_uk/";
    var params = document.URL.split("?")[1].split("&amp;");
    for (var i = 0; i < params.length; i = i + 1) {
        var param = params[i].split("=");
        if (param[0] === "SPAppWebUrl") appweburl = param[1];
    }
    followingManagerEndpoint = decodeURIComponent(appweburl) + "/_api/social.following";
    getMyFollowedCount();
    
});

// Get the count of content that the current user is following.
// The "types=14" parameter specifies all content types
// (documents = 2 + sites = 4 + tags = 8).
function getMyFollowedCount() {
    $.ajax({
        url: followingManagerEndpoint + "/my/followedcount(types=14)",
        headers: {
            "accept": "application/json;odata=verbose"
        },
        success: function (data) {
            followedCount = data.d.FollowedCount;
            getMyFollowedContent();
        },
        error: requestFailed
    });
}

// Get the content that the current user is following.
// The "types=14" parameter specifies all content types
// (documents = 2 + sites = 4 + tags = 8).
function getMyFollowedContent() {
    $.ajax({
        url: followingManagerEndpoint + "/my/followed(types=14)",
        headers: {
            "accept": "application/json;odata=verbose"
        },
        success: followedContentRetrieved,
        error: requestFailed
    });
}

// Parse the JSON data and iterate through the collection.
function followedContentRetrieved(data) {
    var stringData = JSON.stringify(data);
    var jsonObject = JSON.parse(stringData);
    var types = {
        1: "document",
        2: "site",
        3: "tag"
    };

    var followedActors = jsonObject.d.Followed.results;
    var followedList = "You're following " + followedCount + " items:";
    for (var i = 0; i < followedActors.length; i++) {
        var actor = followedActors[i];
        // string contained errors
        followedList += "<p>The " + types[actor.ActorType] + ": \\" +
            actor.Name + "\\</p>";
    }
    $("#message").html(followedList);
}

function requestFailed(xhr, ajaxOptions, thrownError) {
    alert('Error:\\n' + xhr.status + '\\n' + thrownError + '\\n' + xhr.responseText);
}