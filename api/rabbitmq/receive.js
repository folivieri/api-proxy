#!/usr/bin/env node

var amqp = require('amqplib/callback_api');


var PROPS = {
	'server':'brmsmsgbib1.ux.corp.local',
	'port':'5672',
	'username':'greenstack',
	'password':'TriNet123',
	'exchange':'platform.exchange',
	'requestQueue':'api-payroll.time.request.queue',
	'responseQueue':'api-payroll.time.response.queue',
	'requestRoute':'payroll.time.request',
	'responseRoute':'payroll.time.response'
};

String.format = function() {
    // The string containing the format items (e.g. "{0}")
    // will and always has to be the first argument.
    var theString = arguments[0];
    
    // start with the second argument (i = 1)
    for (var i = 1; i < arguments.length; i++) {
        // "gm" = RegEx options for Global search (more than one instance)
        // and for Multiline search
        var regEx = new RegExp("\\{" + (i - 1) + "\\}", "gm");
        theString = theString.replace(regEx, arguments[i]);
    }
    
    return theString;
}
 

var SERVER = String.format('amqp://{0}:{1}@{2}:{3}', PROPS.username, PROPS.password, PROPS.server, PROPS.port)
console.log("[Connection] " + SERVER);

amqp.connect(SERVER, function(err, conn) {
  conn.createChannel(function(err, ch) {
    var q = PROPS.responseQueue;

	ch.assertExchange(PROPS.exchange, 'topic', {durable: true});
    //ch.assertQueue(q, {durable: true});
    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q);
    ch.consume(q, function(msg) {
      console.log(" [x] Received %s", msg.content.toString());
    }, {noAck: true});
  });
});