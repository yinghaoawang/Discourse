const { getServers, addServer } = require('../db.utils');

module.exports = async (io) => {
    const { onNamespaceConnect } = await require('./namespaceHandler')(io);

    (async () => {
        const servers = await getServers();

        // const serverData = { name: 'newServer' + servers.length, id: servers.length };
        // await addServer({ serverData });
        // servers = await getServers();

        servers.forEach(server => {
        const namespace = io.of('/' + server.name);
        namespace.on('connect', socket => {
            onNamespaceConnect({ socket, server, namespace })
        });
    });
    })();

    const onSocketConnect = async (socket) => {
        console.log('connect');
        const servers = await getServers();
        socket.emit('servers', { servers });
    
        socket.on('disconnect', () => {
            console.log('disconnect');
        })
    }
    
    return { onSocketConnect };
}