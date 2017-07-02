/**
 * Created by Bench on 4/30/2016.
 */

var twitch_channel = 'aaronnbrock';
var livecoding_channel = 'aaronnbrock';

var fs = require('fs');

var bots = require('./Bots.js');

var credentials = JSON.parse(fs.readFileSync('credentials.json', 'utf8'));

var username = credentials.username;
var oauth = credentials.twitchauth;
var twitch_room = '#' + twitch_channel;

var jid = credentials.username + '@livecoding.tv';
var password = credentials.password;
var room_jid = livecoding_channel + '@chat.livecoding.tv';


var crossbot = new bots.CrossBot();

crossbot.addBot(new bots.IRCBot("irc.twitch.tv", username, {
    channels: [twitch_room],
    username: username,
    password: oauth
}));

crossbot.addBot(new bots.XMPPBot(jid, password, room_jid));