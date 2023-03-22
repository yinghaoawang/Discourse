// socket singleton used as an alternative to redux

let url = 'localhost:1250';
let options = { transports: ['websocket'] };
if (process.env.NODE_ENV === 'production') {
    url = process.env.REACT_APP_SOCKET_URL;
    options = {
        ...options,
        path: process.env.REACT_APP_SOCKET_PATH,
        secure: process.env.NODE_ENV ? true : false
    };
}

let socket = null;
const getSocket = () => {
    return socket;
}

const setSocket = (newSocket) => { 
    socket = newSocket;
}

export { getSocket, setSocket, url, options }