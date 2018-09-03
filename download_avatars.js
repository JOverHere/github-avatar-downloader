var request = require('request');
var secrets = require('./secrets');
var fs = require("fs");

var myArgs = process.argv.slice(2);


console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, cb) {
  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      'User-Agent': 'request',
      'Authorization': `token ${secrets.GITHUB_TOKEN}`
    }
  };



  request(options, function(err, res, body) {
    var info = JSON.parse(body);

    cb(err, info);
  });
}


function downloadImageByURL(url, filepath) {
  request.get(url)               // Note 1
       .on('error', function (err) {                                   // Note 2
         throw err;
       })
       .on('response', function (response) {                           // Note 3
         console.log('Response Status Code: ', response.statusCode, response.statusMessage, response.headers['content-type']);
       })
       .pipe(fs.createWriteStream(filepath));
}

getRepoContributors(myArgs[0], myArgs[1], function(err, result) {
  if( myArgs[0] || myArgs[1] === undefined){
    console.log("Please enter two arguements :) thank you kindly! ")
  } else {
  console.log("Errors:", err);
  console.log("Result:", result);
   result.forEach(function(item){
      downloadImageByURL(item.avatar_url, `avatars/${item.login}.jpg`);
    })
  }
});



