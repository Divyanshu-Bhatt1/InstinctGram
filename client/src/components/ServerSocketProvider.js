// // // ServerSocket.js

// import React, { useEffect, useState, createContext, useContext } from 'react';
// import { io } from 'socket.io-client';

// const SocketContext = createContext();

// export const useSocket = () => useContext(SocketContext);

// export const ServerSocketProvider = ({ userId, isLoggedIn, children }) => {
//   const [socket, setSocket] = useState(null);

//   useEffect(() => {
//     if (isLoggedIn) {
//       const newSocket = io(`${process.env.REACT_APP_SOCKET_URL}`, {
//         auth: {
//           token: userId
//         }
//       });

//       setSocket(newSocket);

      // return () => {
      //   // alert('hello')
      //   newSocket.disconnect();
      // };
//     }
//   }, [userId, isLoggedIn]);

//   return (
//     <SocketContext.Provider value={socket}>
//       {children}
//     </SocketContext.Provider>
//   );
// };


