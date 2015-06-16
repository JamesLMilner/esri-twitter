
    require([
        "dojo/dom",
        "dojo/query",
        "dojo/dom-form",
        "dojo/on",
        "dojo/request",
        "esri/map",
        "esri/geometry/Point",
        "esri/graphic",
        "esri/layers/GraphicsLayer",
        "esri/symbols/PictureMarkerSymbol",
        "esri/InfoTemplate",
        "esri/geometry/webMercatorUtils",
        "esri/dijit/Search",
        "dojo/domReady!"
        ],
    function(
        dom, query, domForm, on, request, Map, Point, Graphic, GraphicsLayer,
        PictureMarkerSymbol, InfoTemplate, webMercatorUtils, Search
    ) {
        var map;
        var tweetLayer;
        var form = dom.byId('form');

        if (navigator.geolocation) {
            console.log("Geolocation is supported")
            navigator.geolocation.getCurrentPosition( function(position) {
                var lat = position.coords.latitude;
                var lon = position.coords.longitude;
                map = generateMap(lon, lat);
            });

        }
        else {
            console.log("Geolocation not supported")
            map = generateMap(0, 30);
        }

        function generateMap(lon, lat) {
            map =  Map("map",{
                basemap:"gray",
                center:[lon, lat ],
                zoom: 8
            })

            map.on("load", function() {
                var s = new Search( { map: map }, "search");
                s.startup();
            });

            return map;
        }

        function getTweets(tag, count, center,radius) {

            request.post("gettweets.php", {
                data: {
                    tag: tag,
                    count: count,
                    center: center,
                    radius : radius
                },
                handleAs : "json"
            }).then( function(tweets){

                console.log(tweets)
                if (tweets && tweets.statuses.length) {
                    query("#tag").style("background-color", "white");
                    if (tweetLayer && tweetLayer != "undefined") { tweetLayer.clear() }
                    tweetLayer = new GraphicsLayer();
                    var symbol = new PictureMarkerSymbol("imgs/twitter_icon.png", 16, 13);

                    tweets.statuses.forEach( function(tweet, index) {
                        var geo = tweet.geo;
                        if (geo && geo.coordinates.length == 2 ) {
                            var longitude = geo.coordinates[1];
                            var latitude =  geo.coordinates[0];

                            var point = new Point(longitude, latitude);
                            var date = "time/date unknown";
                            if (tweet.created_at) {
                                date = tweet.created_at.replace("+0000", "");
                            }

                            // Title and then content of popup
                            var infoTemplate = new InfoTemplate(
                                "<a href='http://www.twitter.com/" + tweet.user.screen_name + "'>" + tweet.user.name + "</a>",
                                "<div class='userphoto'><img class='photo' src='" + tweet.user.profile_image_url + "'></div><div class='usertext'>" + tweet.text  + "<br><br><br><b>Tweeted: </b> " + date + "</div>"
                            );

                            var graphic = new Graphic(point, symbol, "" , infoTemplate);
                            tweetLayer.add(graphic);
                        }
                    });

                    map.addLayer(tweetLayer);
                    console.log("Done adding tweets");
                }

                else {
                    query("#tag").style("background-color", "rgb(255, 93, 80)");
                    console.log("No tweets found with this tag!")
                }

            });
        }

        // Attach the onsubmit event handler of the form
        on(form, "submit", function(evt){

            // prevent the page from navigating after submit
            evt.stopPropagation();
            evt.preventDefault();

            var tag = dom.byId('tag').value; // Get the form value
            var count = 100;  // 100 is the return allowed
            var objectCenter = webMercatorUtils.webMercatorToGeographic(map.extent.getCenter());
            var center = objectCenter.x + "," + objectCenter.y;
            var radius = (map.extent.getWidth() / 1000) / 2;
            // The width is in meters so divide by 1000, and to get a good radius divide by 2

            getTweets(tag, count, center, radius);

        });

    });
