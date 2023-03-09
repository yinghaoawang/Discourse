const { getServers, addServer } = require('../db.utils');

module.exports = async (io) => {
    const { onNamespaceConnect } = require('./namespaceHandler')(io);

    const serverData = { name: 'newServer' };
    await addServer({ serverData });
    const servers = await getServers();
    servers.forEach(server => {
        const namespace = io.of('/' + server.name);
        namespace.on('connect', socket => {
            onNamespaceConnect({ socket, server, namespace })
        });
    });

    const onSocketConnect = (socket) => {
        console.log('connect');
        socket.emit('servers', { servers });
    
        socket.on('disconnect', () => {
            console.log('disconnect');
        })
    }
    
    return { onSocketConnect, servers };
}