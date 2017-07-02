/**
 * Created by Bench on 8/8/2016.
 */

var fs = require('fs');
var bots = require('./Bots.js');
var CleverBot = require('cleverbot-node');

var livecoding_channel = 'aaronnbrock';




var credentials = JSON.parse(fs.readFileSync('credentials.json', 'utf8'));

var username = credentials.username;
var jid = username + '@livecoding.tv';
var password = credentials.password;
var room_jid = livecoding_channel + '@chat.livecoding.tv';

var cleverbot = new CleverBot;

var xmpp_bot = new bots.XMPPBot(jid, password, room_jid)


var reg = new RegExp("^([\\W]*" + username + "[\\W]*)", "i");


xmpp_bot.addListener('message', function(from, message)
{
    if (reg.test(message))
    {
        message = message.replace(reg, "");

        console.log(message);

        CleverBot.prepare(function(){
            cleverbot.write(message, function(response) {
                xmpp_bot.sendMessage(from + " " + response.message);
            });
        });

    }

});


