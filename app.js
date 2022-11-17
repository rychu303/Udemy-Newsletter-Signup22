//EXPRESS
const express = require("express");
const app = express();
//BODY PARSER
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
// EXPRESS STATIC
app.use(express.static("public"));
//HTTPS REQUESTS
const https = require("node:https");
const request = require("node:http");

app.get("/", (req, res)=> {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", (req, res)=> {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.emailAddress;

    const data = {
        members: [
            {
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: firstName,
                LNAME: lastName
            }

            }

        ]
        
    }

    let jsonData = JSON.stringify(data);

    const url = "https://us9.api.mailchimp.com/3.0/lists/1eb35a4bd3";
    const options = {
        method: "POST",
        auth: "rchungUserName:04daf929724a0f839f8e4d4898cc08ab-us9"
    }

    const mcRequest = https.request(url, options, function(response) {
        console.log(response.statusCode);
        //ROUTES SUCCESS OR FAILURE PAGE DEPENDING ON THE STATUSCODE SENT BACK FROM THE SERVER
        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html"); 
        } else {
            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data", (data)=>{
                console.log(JSON.parse(data));
        });
    });

    mcRequest.write(jsonData);
    mcRequest.end();

});

//REDIRECTS THE RETRY BUTTON ON FAILURE PAGE BACK TO THE HOME ROUTE
app.post("/failure", (req, res) => {
    res.redirect("/");
})

app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running on port 3000");
});

//MAILCHIMP API KEY: 04daf929724a0f839f8e4d4898cc08ab-us9
//MAILCHIMP LIST/AUDIENCE ID: 1eb35a4bd3