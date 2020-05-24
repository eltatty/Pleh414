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
                    // console.log(
                    //     'Failed to list children of %s due to: %s.',
                    //     path,
                    //     error
                    // )
                    callback(error)
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

module.exports = zoo_children