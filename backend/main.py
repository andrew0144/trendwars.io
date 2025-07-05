import warnings
from flask import Flask, request 
from flask_socketio import SocketIO, emit
from flask_cors import CORS
from Message import Message, MessageType
from Handlers import * 
from Lobby import LobbyIDGenerator
from ConnectionManager import ConnectionManager
from termcolor import colored

# connection setup stuff
app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*", ping_timeout=5, ping_interval=5)

lobbyIDGenerator = LobbyIDGenerator() # struct to easily generate unique, 6-uppercase-letter lobby IDs 
lobbies = [] # List of all active lobbies
idToPlayer = {} #map player id to player object for quick access
CM = ConnectionManager(app, lobbies, socketio) # Manages all the connections and messages so you don't need to worry too much about it's details


# This function is called whenever a new player connects to the server
@socketio.on('connect')
def connect():
    global CM
    CM.add_connection(request)
    

@socketio.on('disconnect')
def disconnect():
    global CM
    CM.remove_connection(request)
    

# Function is called whenever a client sends any information to the server 
# The message is decoded, and the correct function is called based on the message type
@socketio.on('message')
def onMessage(msg):
    global CM
    global lobbies
    decodedMessage = Message.fromJSON(msg)
    sendingPlayer = None

    # Check if we've registered this player (we should have whenever this function is called)
    # "Registering a player" -> mapping a socket (i.e. individual connection) to a player object
    if CM.is_connected(request.sid):
        sendingPlayer = CM.get_player(request.sid)
    else:
        warnings.warn(colored("Warning: Socket not associated with a player. \'none\' will be used as the sending player. Bad things will probably happen", "yellow"))

    #if the player who sent this message has been registered and is in a lobby/game, handle the message there
    if sendingPlayer is not None and sendingPlayer.lobbyID is not None:
        lobbyID = sendingPlayer.lobbyID
        for lobby in lobbies:
            if lobby.id == lobbyID:
                lobby.handleMessage(decodedMessage, sendingPlayer)
                break
        return 



    msgType = decodedMessage.msgType
    print(type(msgType))
    # Most messages will be interpreted by the player's corresponding lobby and are routed there 
    # However, some must be interpreted before a player is in any lobby
    # for each new message type we make, add a new case here for how to handle it + associated handler function
    match msgType:
        case "PLAYER_UPDATE":
            handlePlayerUpdateMsg(sendingPlayer, decodedMessage.msgData['data']['username'], decodedMessage.msgData['data']['variant'], CM)
        case "PLAYER_JOIN":
            handlePlayerJoinMsg(sendingPlayer, CM, lobbies, decodedMessage.msgData['data']['lobbyID'])
        case "CREATE_LOBBY":
            sid = request.sid
            if sendingPlayer.lobbyID is None:
                handleCreateLobbyMsg(decodedMessage, sendingPlayer, CM.get_sid_to_player(), sid, lobbies, lobbyIDGenerator.generateNewID(), CM)
            else:
                warnings.warn(colored("Warning: Player in a lobby tried to create another lobby. That shouldn't happen", "yellow"))
        case "URL":
            if sendingPlayer.lobbyID is not None:
                warnings.warn(colored("Player already in a lobby somehow, even though they joined via URL?. Not handling request.", "yellow"))
            else:
                raw_data = decodedMessage.msgData['data']
                
                split_data = raw_data.rsplit('/', 1)
                lobbyID = split_data[1]
                for lobby in lobbies:
                    if lobby.id == lobbyID:
                        lobby.addPlayer(sendingPlayer)
                        sendingPlayer.lobbyID = lobby.id
                        CM.send_to_player(sendingPlayer, Message(MessageType.LOBBY_JOINED, {"lobbyID": lobby.id}))
                        CM.send_to_all_in_lobby(lobbyID, Message(MessageType.LOBBY_STATE, lobby.getLobbyState()))
                        warnings.warn(colored(f"Sending lobby settings: {lobby.gameSettings}", "yellow"))
                        CM.send_to_player(sendingPlayer, Message(MessageType.LOBBY_SETTINGS_UPDATED, lobby.gameSettings))
                        CM.send_to_player(sendingPlayer, Message(MessageType.CHAT, {
                            "username": 'System',
                            "variant": 'beam',
                            "text": "Lobby settings updated."
                        }))
                        return
                if 'lobby' in split_data[0]:
                    CM.send_to_player(sendingPlayer, Message(MessageType.LOBBY_DOESNT_EXIST, {'data': 'bruh moment'}))
                    warnings.warn(colored(f"No lobby with ID {lobbyID} exists. Sending a LOBBY_DOESNT_EXIST message to client.", "yellow"))
        case _:
            raise Exception(f'Invalid message type. A type of {msgType} was received, but no corresponding function exists')
            
# For ELB health check.
@app.route("/health")
def health_check():
    return "OK", 200

def main():
    socketio.run(app, host='0.0.0.0', port=8000, allow_unsafe_werkzeug=True)

if __name__ == '__main__':
    main()