'use strict';

var dockerCmdJs = require('docker-cmd-js');
var cmd = new dockerCmdJs.Cmd();

cmd.run('docker build -t srijanss/gettempapp .');
// .then(() => cmd.run('docker run -p 10011:10010 -d srijanss/gettempapp'));
