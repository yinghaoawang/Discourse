const { getServers, addServer } = require('../db.utils');

module.exports = async (io) => {
    const { onNamespaceConnect } = await require('./namespaceHandler')(io);
    const { addVoiceRoomListeners } = await require('./voiceRoomHandler')(io);

    addSocketListeners = ({ socket }) => {
        const sendServers = async () => {
            socket.emit('servers', { servers: await getServers() });
        }

        socket.on('getServers', sendServers)
        socket.on('addServer', onAddServer);
    }

    const addNspListeners = async ({ server }) => {
        const namespace = io.of('/' + server.name);
        namespace.on('connect', socket => {
            onNamespaceConnect({ socket, server })
            socket.on('addServer', (payload) => {
                onAddServer(payload);
            });
            addSocketListeners({ socket });
            addVoiceRoomListeners({ socket, namespace, server });
        });
    }

    const onAddServer = async ({ serverData }) => {
        let servers = await getServers();
        const newServerData = { ...serverData, id: servers.length };
        await addServer({ serverData: newServerData });
        await addNspListeners({ server: newServerData });
        
        for (const nspKey of io._nsps.keys()) {
            const nsp = io.of(nspKey);
            servers = await getServers();
            nsp.emit('servers', { servers });
        }
    }

    (async () => {
        const servers = await getServers();
        servers.forEach(server => {
            addNspListeners({ server })
        });
    })();

    const onSocketConnect = async (socket) => {
        console.log('connect to /');

        addSocketListeners({ socket });

        socket.on('disconnect', () => {
            console.log('disconnect from /');
        })
    }
    
    return { onSocketConnect };
}