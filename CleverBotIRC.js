/**
 * Created by Bench on 8/8/2016.
 */

var fs = require('fs');
var bots = require('./Bots.js');
var CleverBot = require('cleverbot-node');

var twitch_channel = 'javascript';




var credentials = JSON.parse(fs.readFileSync('credentials.json', 'utf8'));

var username = credentials.username;
var oauth = credentials.twitchauth;
var twitch_room = '#' + twitch_channel;




var cleverbot = new CleverBot;


var twitch_bot = new bots.IRCBot("chat.freenode.net", username, {
    channels: ['#aaronsbot'],
    username: username,
    password: "password"
});

//twitch_bot.sendMessage("/msg NickServ IDENTIFY benchsbot password");

var reg = new RegExp("^([\\W]*" + username + "[\\W]*)", "i");

twitch_bot.addListener('message', function(from, message)
{
    if (reg.test(message))
    {
        message = message.replace(reg, "");

        CleverBot.prepare(function(){
            cleverbot.write(message, function(response) {
                twitch_bot.sendMessage(from + " " + response.message);
            });
        });
    }

});


