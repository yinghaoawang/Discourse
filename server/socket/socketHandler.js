const { getServers, addServer, addUser, getUser, setUser } = require('../db.utils');

module.exports = async (io) => {
    const { onNamespaceConnect } = await require('./namespaceHandler')(io);
    const { addVoiceRoomListeners } = await require('./voiceRoomHandler')(io);

    addSocketListeners = ({ socket }) => {
        const sendServers = async () => {
            socket.emit('servers', { servers: await getServers() });
        }

        socket.on('addUser', async ({ userId, displayName }) => {
            await addUser({ userId, userData: { userId, displayName }});
            const user = await getUser({ userId });
            
            socket.emit('updateCurrentUser', user);
        });

        socket.on('updateUser', async ({ userId, displayName, statusMessage }) => {
            await setUser( { userId, userData: { userId, displayName, statusMessage } });
            const user = await getUser({ userId });
            console.log('update user', user, userId);

            socket.emit('updateCurrentUser', user);
        })

        socket.on('getUser', async ({ userId }) => {
            let user = await getUser({ userId });
            if (user == null) {
                user = { userId, displayName: 'Unknown' };
            }

            socket.user = user;
            socket.userId = userId;

            console.log('getting user', user);
            socket.emit('updateCurrentUser', user);
        });

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