import openSocket from 'socket.io-client';

export let server_location = 'https://trendwars.io:8000';
// if (process.env.REACT_APP_LOCAL !== undefined) {
//     console.log("Will be connecting to local server.")
//     server_location = "http://localhost:8000"
// }
// else {
//     console.log("Will be connecting to AWS Fargate Backend.")
//     server_location = "http://35.93.16.219:8000"
// }
export const ws = openSocket(server_location);
