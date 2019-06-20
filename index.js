'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const fs = require("fs"); 

const app = express()

let token = "EAAFZCR29qoPABAIcqeqlhA6jJ5l854MkyBt98PiohmcsN3XOCRQ6B8YSR56uv2D66cOGTugkHjhldKdGcJUPo3PTmNAeWmE9ggngbyVDapAiV4SZCSHKEZAbrKip2LOM4mZBqioK3m6ngj5tegD3r70MpPhI2wSGtnuWhokzIQZDZD"

app.set('port', (process.env.PORT || 5000))

//middleware para procesar data
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

//rutas

app.get('/', function(req, res){
    res.send('Hi I am a chatbot')
})

//facebook

app.get('/webhook', function(req, res){
    if(req.query['hub.verify_token'] == 'willianTest'){
        res.send(req.query['hub.challenge'])
    }
    res.send("Wrong token")
})

app.post('/webhook', function(req, res){
    
    /*if (fs.existsSync('./images')) {
        console.log('exste')
    }*/

    let messaging_events = req.body.entry[0].messaging
    for(let i = 0; i < messaging_events.length; i++){
        let event = messaging_events[i]
        let sender = event.sender.id
        /*if(event.message && event.message.text){
            let text = event.message.text
            
            //Checking for attachments
            if (event.message.attachments) {
                //Checking if there are any image attachments 
                if(atts[0].type === "image"){
                    var imageURL = atts[0].payload.url;
                    console.log(imageURL);
                }
            }*/

        /*if(event.message && event.message.text){
            
            let text = event.message.text            
            sendText(sender, text)
        }*/
        if(event.message){
            //Create the attachment
            let attachment = event.message.attachments

            // Here we access the JSON as object
            let object1 = attachment[0];

            //Here we access the payload property 
            let payload = object1.payload;

            // Finally we access the URL
            let url = payload.url;

            console.log(url)
        }
        else if (event.message && event.message.text) {
           // Here you can handle the text 
           console.log("Just Text")
        } 
    //}
    res.sendStatus(200)
    }
})

function sendText(sender, text){

    let products = [{
        "Id": 1,
        "Name": "nike",
        "Price": "120.08"
    }, {
        "Id": 2,
        "Name": "adidas",
        "Price": "60.20"
    }, {
        "Id": 3,
        "Name": "puma",
        "Price": "30.23"
    }, {
        "Id": 4,
        "Name": "new balance",
        "Price": "10.25"
    }]
      
    let results = products.filter(function(product) {
        return product.Name.indexOf(text) > -1;
    });

    let textMessage = "precio: "+results[0].Price
    let messageData = {text: textMessage}
    request({
        url: "https://graph.facebook.com/v2.6/me/messages",
        qs: {access_token : token},
        method: "POST",
        json:{
            recipient:{id: sender},
            message: messageData
        }
    }, function(error, response, body){
        if(error){
            console.log("sending error")
        }else if(response.body.error){
            console.log("response body error")
        }
    })
}

app.listen(app.get('port'), function(){
    console.log("running: port")
})