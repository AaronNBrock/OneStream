/**
 * Created by Bench on 8/8/2016.
 */

var fs = require('fs');
var bots = require('./Bots.js');
var CleverBot = require('cleverbot-node');

var twitch_channel = 'binarybench';




var credentials = JSON.parse(fs.readFileSync('credentials.json', 'utf8'));

var username = credentials.username;
var oauth = credentials.twitchauth;
var twitch_room = '#' + twitch_channel;




var cleverbot = new CleverBot;


var twitch_bot = new bots.IRCBot("irc.twitch.tv", username, {
    channels: [twitch_room],
    username: username,
    password: oauth
});

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


