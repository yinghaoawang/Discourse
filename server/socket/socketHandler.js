const { getServers, addServer, getChannels, addChannel } = require('../db.utils');

module.exports = async (io) => {
    const { onNamespaceConnect } = await require('./namespaceHandler')(io);

    const setupServerListeners = ({ server }) => {
        const namespace = io.of('/' + server.name);
        namespace.on('connect', socket => {
            onNamespaceConnect({ socket, server })
            socket.on('addServer', (payload) => {
                onAddServer(payload);
            });
        });
    }

    const onAddServer = async ({ serverData }) => {
        let servers = await getServers();
        const newServerData = { ...serverData, id: servers.length };
        await addServer({ serverData: newServerData });
        setupServerListeners({ server: newServerData });
        
        for (const nspKey of io._nsps.keys()) {
            const nsp = io.of(nspKey);
            servers = await getServers();
            nsp.emit('servers', { servers });
        }
    }

    (async () => {
        const servers = await getServers();
        servers.forEach(server => {
            setupServerListeners({ server })
        });
    })();

    const onSocketConnect = async (socket) => {
        console.log('connect');
        const servers = await getServers();
        socket.emit('servers', { servers });

        socket.on('addServer', (payload) => {
            onAddServer(payload);
        });
    
        socket.on('disconnect', () => {
            console.log('disconnect');
        })
    }
    
    return { onSocketConnect };
}