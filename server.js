// Dependencies
// =============================================================
var express = require("express");
var path = require("path");
var friends = require(path.join(__dirname, "app/data/friends.js"));

// Sets up the Express App
// =============================================================
var app = express();
var PORT = process.env.PORT || 3000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
// =============================================================

// Basic route that sends the user first to the AJAX Page
app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "app/public/home.html"));
});

app.get("/survey", function(req, res) {
  res.sendFile(path.join(__dirname, "app/public/survey.html"));
});

app.get("/api/friends", function(req, res) {
  return res.json(friends);
});

app.post("/api/friends", function(req, res) {
  //compare with existing users
  var result;
  var bestMatch = {
    score: 100,
    index: 0
  };
  for (var n = 0; n < friends.length; n++) {
    result = 0;
    for (var i = 0; i < 10; i++) {
      result += Math.abs(req.body.scores[i] - friends[n].scores[i]);
    }
    console.log(
      "Comparacion user " + n + ": " + result + "  name: " + friends[n].name
    );
    if (result < bestMatch.score) {
      bestMatch.index = n;
      bestMatch.score = result;
    }
  }
  //Add it to the frends array
  friends.push(req.body);

  console.log(req.body);
  console.log("best Match: " + JSON.stringify(bestMatch));
  res.send(friends[bestMatch.index]);
  //return res.json(friends[bestMatch.index]);
});

// Starts the server to begin listening
// =============================================================
app.listen(PORT, function() {
  console.log("App listening on PORT " + PORT);
});
