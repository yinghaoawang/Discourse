const serversDb = require('./serversDb');

const servers = serversDb.map((server, index) => ({
    id: index + 1,
    name: server.name,
    channels: server.channels.map(channel => ({ name: channel.name }))
}));

module.exports = (io) => {
    const { onNamespaceConnect } = require('./namespaceHandler')(io);
    serversDb.forEach(server => {
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
    
    return { onSocketConnect };
}