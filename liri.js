require("dotenv").config();
var Spotify = require("node-spotify-api");
var keys = require("./keys.js");
var axios = require("axios");
var moment = require("moment");
var fs = require("fs");

var spotify = new Spotify(keys.spotify);

var Command = process.argv[2];
var Query = process.argv.slice(3).join(' ');

function runCommand() {
    if (Command === "do-what-is-says") {
        fs.readFile("random.txt", "utf8", function (_error, data) {
            console.log(data)
        });
    } else if (Command === "concert-this") {
        console.log("foo")
        axios.get("https://rest.bandsintown.com/artists/" + Query + "/events?app_id=codingbootcamp").then(
            function (res) {
                for (var x = 0; x < res.data.length; x++) {
                    console.log("Venue: " + res.data[x].venue.name);
                    console.log("Venue Location: " + res.data[x].venue.city + ", " + res.data[x].venue.region + " " + res.data[x].venue.country);
                    console.log("Date: " + moment(res.data[x].datetime).format("MM/DD/YYYY"));
                    console.log("----------------------")
                }
            }
        );
    } else if (Command === "spotify-this-song") {
        if (Query === "") { Query = "Ace of Base The Sign" }
        spotify
            .search({
                type: 'track',
                query: Query,
                limit: 1
            })
            .then(function (res) {
                console.log(JSON.stringify(res.tracks.items[0].artists[0].name, null, 2));
                console.log(JSON.stringify(res.tracks.items[0].name, null, 2));
                console.log(JSON.stringify(res.tracks.items[0].preview_url, null, 2));
                console.log(JSON.stringify(res.tracks.items[0].album.name, null, 2));
            })
            .catch(function (err) {
                console.log(err);
            });
    } else if (Command === "movie-this") {
        if (Query === "") { Query = "Mr. Nobody" }
        axios.get("http://www.omdbapi.com/?t=" + Query + "&y=&plot=short&apikey=trilogy").then(
            function (res) {
                console.log("Movie Title: " + res.data.Title);
                console.log("Year: " + res.data.Year);
                console.log("IMDB Rating: " + res.data.imdbRating);
                console.log("Rotten Tomatoes Rating: " + res.data.Ratings[1].Value);
                console.log("Country Produced: " + res.data.Country);
                console.log("Language: " + res.data.Language);
                console.log("Plot: " + res.data.Plot);
                console.log("Actors: " + res.data.Actors);
            });
    };
};

runCommand();

