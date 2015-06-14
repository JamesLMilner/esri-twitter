
    require([
        "esri/map",
        "esri/geometry/Point",
        "esri/graphic",
        "esri/layers/GraphicsLayer",
        "esri/symbols/PictureMarkerSymbol",
        "esri/InfoTemplate",
        "esri/geometry/webMercatorUtils",
        "esri/dijit/Search",
        "dojo/domReady!"],
    function(
        Map, Point, Graphic, GraphicsLayer, PictureMarkerSymbol, InfoTemplate, webMercatorUtils, Search
    ) {
        var map;
        var tweetLayer;

        if (navigator.geolocation) {
            console.log("Geolocation is supported")
            navigator.geolocation.getCurrentPosition( function(position) {

                var lat = position.coords.latitude;
                var lon = position.coords.longitude;
                map = Map("map",{
                            basemap:"gray",
                            center:[lon, lat],
                            zoom: 8
                        });

                map.on("load", function() {
                            var s = new Search( { map: map }, "search");
                            s.startup();
                        });
            });

        } else {
            console.log("Geolocation not supported")
            map = Map("map",{
                basemap:"gray",
                center:[0, 20],
                zoom: 8
            });

            map.on("load", function() {
                var s = new Search( { map: map }, "search");
                s.startup();
            });
        }

        function getTweets(tag, count, center,radius) {

            $.ajax({
                url: "gettweets.php",
                data: {
                    "tag": tag,
                    "count": count,
                    "center": center,
                    "radius" : radius
                },
                success: function(tweets) {
                    map.graphicsLayerIds[0]
                    console.log(map);
                    console.log(tweets);

                    if (tweetLayer && tweetLayer != "undefined") { tweetLayer.clear() }
                    tweetLayer = new GraphicsLayer();
                    //console.log(tweets);
                    var symbol = new PictureMarkerSymbol("imgs/twitter_icon.png", 16, 13);

                    tweets.statuses.forEach( function(tweet, index) {
                        var geo = tweet.geo
                        if (geo && geo.coordinates.length == 2 ) {
                            var longitude = geo.coordinates[1];
                            var latitude =  geo.coordinates[0];
                            //console.log(longitude, latitude)
                            var point = new Point(longitude, latitude);
                            var date;
                            if (tweet.created_at) {
                                date =  tweet.created_at.replace("+0000", "");

                            }


                            var infoTemplate = new InfoTemplate(
                                "<a href='http://www.twitter.com/" + tweet.user.screen_name + "'>" + tweet.user.name + "</a>",
                                "<div class='userphoto'><img class='photo' src='" + tweet.user.profile_image_url + "'></div><div class='usertext'>" + tweet.text  + "<br><br><br><b>Tweeted: </b> " + date + "</div>"
                            );

                            //console.log(infoTemplate);
                            var graphic = new Graphic(point, symbol, "" , infoTemplate);
                            //console.log(point, graphic);
                            tweetLayer.add(graphic);
                        }
                    });

                    map.addLayer(tweetLayer);
                    console.log("Done adding tweets");
                },
                dataType: "json"
            });
      }


      $('#form').on('submit', function(e) {
          e.preventDefault();
          console.log("Map", map)
          var data = $("#form :input").serializeArray();
          var tag = data[0].value;
          var count = 100;  //+data[1].value;
          var objectCenter = webMercatorUtils.webMercatorToGeographic(map.extent.getCenter());
          var center = objectCenter.x + "," + objectCenter.y;
          var radius = (map.extent.getWidth() / 1000) / 2;
          // The width is in meters so divide by 1000, and to get a good radius divide by 2

          console.log(tag, count, center);

          if (typeof tag == "string" && isNaN(count) == false ) {
              console.log("Getting tweets");
              $("#tag").css("background-color", "white");
              $("#count").css("background-color", "white");
              getTweets(tag, count, center, radius);
          }

      });

    });
