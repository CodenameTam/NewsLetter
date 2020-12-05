// jshint esversion: 6
require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");

const app = express();

app.use(express.static("public")); //allows local files to be on static site
app.use(bodyParser.urlencoded({extended: true})); // have to use this


app.get("/", function(req, res) { //request and send the home page from server
    res.sendFile(__dirname + "/signup.html"); // current file of homepage
});

app.post("/", function(req, res){ // what the screen takes from person's input

    var firstName = req.body.fName;
    var lastName = req.body.lName;
    var email = req.body.email;

    var data = {
        members: [ // reflect what mailchimp wants to convert
            {
                email_address: email, // one at a time
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            } 
        ] 
    };

    var jsonData = JSON.stringify(data); // flatpack that thang

    var options = {
        url: process.env.LIST_ID, // where it needs to post to
        method: "POST", // what it will do - post to mailchimp
        headers: { // object to pass along
            "Authorization": process.env.API_KEY // *http & request module to identify* first part is anything(username)
        },
        body: jsonData,
    };

    request(options, function(error, response, body){ // 1ST - then sort out each item in order and put them where they need to go
        if (error) { // getting error out of the way
            res.send("<h1>There was an error sis!</h1>");
        } else {
            if (response.statusCode === 200) { // if it's equal to 200
                res.sendFile(__dirname + "/success.html"); // You in there Boo!" //res.sendFile(__dirname + "/success.html")
            } else {
                res.send("No ma'am!");
            }
        }
    });


});

app.listen(process.env.PORT || 3000, function(){ //app will work on heroku or local server
    console.log("Server on Sis");
});


