#!/usr/bin/env node

var amqp = require('amqplib/callback_api'),
    fs = require('fs');

const csv=require('csvtojson')

var PROPS = {
	'server':'brmsmsgbib1.ux.corp.local',
	'port':'5672',
	'username':'greenstack',
	'password':'TriNet123',
	'exchange':'platform.exchange',
	'requestQueue':'api-payroll.time.request.queue',
	'responseQueue':'api-payroll.time.response.queue',
	'requestRoute':'payroll.time.request'
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
    var ex = PROPS.exchange;
    var msg = process.argv.slice(2).join(' ') || 'Hello World!';
    
	try {  
		msg = fs.readFileSync('users.json', 'utf8');
	} catch(e) {
		console.log('Error:', e.stack);
	}
    

    ch.assertExchange(ex, 'topic', {durable: true});
    ch.publish(ex, PROPS.requestRoute, new Buffer(msg));
    console.log(" [x] Sent %s", msg);
  });

  setTimeout(function() { conn.close(); process.exit(0) }, 500);
});