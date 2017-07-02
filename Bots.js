
/**
 * Created by Bench on 4/30/2016.
 */
exports.IRCBot = IRCBot;
exports.XMPPBot = XMPPBot;
exports.CrossBot = CrossBot;

var util = require('util');
var irc = require('irc');
var xmpp = require('node-xmpp-client');
var fs = require('fs');
var EventEmitter = require('events').EventEmitter;


/*   -=-   Empty Bot   -=-   */
function EmptyBot()
{
    EventEmitter.call(this);
}
util.inherits(EmptyBot, EventEmitter);

EmptyBot.prototype.sendMessage = function(message)
{

};

/*   -=-   Cross Bot   -=-   */

function CrossBot(bots)
{
    EmptyBot.call(this);

    bots = bots || [];
    this.bots = [];
    for (var i = 0; i < bots.length; i++)
    {
        this.addBot(bots[i]);
    }

}
util.inherits(EmptyBot, EventEmitter);

CrossBot.prototype.addBot = function(bot)
{
    this.bots.push(bot);
    var self = this;
    bot.addListener('message', function(from, message)
    {
        self.say(from, message, bot);
    });

};


CrossBot.prototype.say = function(from, message, bot)
{
    bot = bot || null;

    for (var i = 0; i < this.bots.length; i++)
    {
        if (this.bots[i] === bot)
            continue;
        this.bots[i].sendMessage(from + ":" + message);

    }
};




/*   -=-   IRC Bot   -=-   */
function IRCBot(server, nick, opt) {
    EmptyBot.call(this);
    var self = this;

    this.client = new irc.Client(server, nick, opt);

    this.client.addListener('error', function(message) {
        console.log('error: ', message);
    });

    this.client.addListener('message', function (from, to, text, message) {
        self.emit('message', from, text);
    });
}
util.inherits(IRCBot, EmptyBot);

IRCBot.prototype.sendMessage = function(message)
{
    for (var i = 0; i < this.client.opt.channels.length; i++)
    {
        this.client.say(this.client.opt.channels[i], message);
    }
};





/*   -=-   XMPP Bot   -=-   */

function XMPPBot(jid, password, room_jid) {
    EmptyBot.call(this);

    var self = this;

    this.room_jid = room_jid;
    var room_nick = new xmpp.JID(jid).local;


    this.xmppbot = new xmpp.Client({
        jid: jid,
        password: password
    });

    this.xmppbot.on('error', function (err) {
        console.error(err);
        process.exit(1);
    });


    // Once connected, set available presence and join room
    this.xmppbot.on('online', function() {
        console.log("We're online!");

        // set ourselves as online
        self.xmppbot.send(new xmpp.Element('presence', { type: 'available' }).
            c('show').t('chat')
        );

        // join room (and request no chat history)

        self.xmppbot.send(
            new xmpp.Element('presence', {to: room_jid+'/'+room_nick}).c('x', { xmlns: 'http://jabber.org/protocol/muc' }).c('history', {maxchars: "0"})
        );

        // send keepalive data or server will disconnect us after 150s of inactivity
        setInterval(function() {
            self.xmppbot.send(' ');
        }, 30000);

    });

    // Once connected, set available presence and join room
    this.xmppbot.on('stanza', function(stanza) {
        // always log error stanzas
        if (stanza.attrs.type == 'error') {
            console.log('[error] ' + stanza);
            return;
        }

        // ignore everything that isn't a room message
        if (!stanza.is('message') || !stanza.attrs.type == 'groupchat') {
            return;
        }

        // ignore messages we sent
        if (stanza.attrs.from == room_jid+'/'+room_nick) {
            return;
        }


        var res = new xmpp.JID(stanza.from);
        // if in group chat the username is the resource
        var from = stanza.attrs.type == 'groupchat' ? res.resource : res.local;


        var body = stanza.getChild('body');
        // message without body is probably a topic change
        if (!body) {
            return;
        }
        var message = body.getText();

        self.emit('message', from, message);

    });
}
util.inherits(XMPPBot, EmptyBot);



XMPPBot.prototype.sendMessage = function(message)
{
    this.xmppbot.send(new xmpp.Element('message', { to: this.room_jid, type: 'groupchat' }).c('body').t(message));
};







