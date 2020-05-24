const zookeeper = require('node-zookeeper-client');

const zoo_con = ()=>{

    const client = zookeeper.createClient('localhost:2181')
    const path = "/Playmaster/Playm1"

    client.connect();

    client.once('connected', function () {
        console.log('Connected to zookeeper server.');

        client.create(path, zookeeper.CreateMode.EPHEMERAL, function (error) {
            if (error) {
                console.log('Failed to create node: %s due to: %s.', path, error);
            } else {
                console.log('Node: %s is successfully created.', path);
            }

            // client.close()
        })
    })

}

module.exports = zoo_con