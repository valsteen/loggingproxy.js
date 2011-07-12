#!/usr/bin/env node

// raw proxy that outputs all incoming/outgoing trafic
if (process.argv.length < 5) {
        var cmd_path_parts = process.argv[1].split("/");
        var cmd = cmd_path_parts[cmd_path_parts.length-1];
        console.log("syntax:",cmd,"host_to_connect","port_to_connect","port_to_listen");
        return;
}

var connect_to_host = process.argv[2];
var connect_to_port = process.argv[3];
var listen_on = process.argv[4];

var net = require("net");
var server = net.createServer(function (c) {
        var remote = net.createConnection(connect_to_port, connect_to_host, function () {
                remote.on("data", function (data) {
                        console.log("SERVER:", data.toString());
                        c.write(data);
                });
                remote.on("close", function () {
                        c.end();
                });
        });

        c.on("data", function (data) {
                console.log("CLIENT:",data.toString());
                remote.write(data);
        });
        c.on("close", function () {
                remote.end();
        });
});
server.listen(listen_on);
