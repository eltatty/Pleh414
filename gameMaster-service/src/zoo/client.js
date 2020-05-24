const zookeeper = require('node-zookeeper-client')

const zoo_children = (callback) => {

    const client = zookeeper.createClient('localhost:2181')
    const path = "/Playmaster"

    function listChildren(client, path) {
        client.getChildren(
            path,
            function (event) {
                // console.log('Got watcher event: %s', event);
                listChildren(client, path)

            },
            function (error, children, stat) {
                if (error) {
                    console.log(
                        'Failed to list children of %s due to: %s.',
                        path,
                        error
                    )
                    callback([])
                }
    
                // console.log('Children of %s are: %j.', path, children)
                callback(children)
            }
        )
    }

    client.once('connected', () => {
        console.log('Connected to ZooKeeper.')
        listChildren(client, path)
    })

    client.connect()
}

const zoo_con = ()=>{

    const client = zookeeper.createClient('localhost:2181')
    const path = "/Playmaster"

    client.once('connected', function () {
        console.log('Connected to zookeeper server.');

        client.create(path, function (error) {
            if (error) {
                console.log('Failed to create node: %s due to: %s.', path, error);
            } else {
                console.log('Node: %s is successfully created.', path);
            }

            client.close()
        })
    })

    client.connect()

}

module.exports = {
    zoo_children,
    zoo_con
}