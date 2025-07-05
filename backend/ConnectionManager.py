from flask_socketio import SocketIO, emit
from Player import Player
from Message import Message, MessageType
from warnings import warn
from termcolor import colored

# abstraction around socketio library
# unless you're messing with connection stuff, you probably don't need to worry about this 
class Socket:
    def __init__(self, socketio, sid):
        self.sid = sid
        self.connected = True
        self.socketio = socketio

    def emit(self, event, data):
        self.socketio.emit(event, data, room=self.sid)

    def getSocketID(self):
        return self.sid

class ConnectionManager:
    def __init__(self, app, lobbies, socketio):
        self.connections = []
        self.nextValidId = 0
        self.socketToPlayer = {}
        self.sidToPlayer = {}
        self.idToPlayer = {}
        self.app = app
        self.socketio = socketio
        self.activeSids = []
        self.lobbies = lobbies
    
    # register a player and their corresponding socket
    def add_connection(self, req):
        sid = req.sid
        self.activeSids.append(sid)
        sock = Socket(self.socketio, sid)
        self.connections.append(sock)
        player = Player(self.nextValidId, "", False)
        self.socketToPlayer[sock] = player
        self.sidToPlayer[sid] = player
        self.nextValidId += 1
        self.send_to_player(player, Message(MessageType.PLAYER_ID, {"your_id": player.id})) # client side should remember this number
        self.send_to_player(player, Message(MessageType.PLAYER_STATE, player.toJSON()))
        print("New connection added. Total connections: ", len(self.connections))

    # This function is called whenever a player disconnects from the server 
    # i.e. if they close the tab or refresh the page
    # Note that it takes a while before the disconnect is registered, so when testing, it might say there are more players connected then there really are
    # They (should) be removed eventually however
    def remove_connection(self, req):
        # Have to loop over all sockets to remove the disconnected one
        # kinda ugly, but shouldn't be a problem if this game doesn't get too big (which it won't lol)
        sid = req.sid
        self.activeSids.remove(sid)
        for sock in self.connections:
            if sock.getSocketID() == sid:
                player = self.socketToPlayer[sock]

                #if player was in lobby, alert people in lobby that this player has left
                if player.lobbyID is not None: 
                    l = None
                    for lobby in self.lobbies:
                        if lobby.id == player.lobbyID:
                            l = lobby

                    l.removePlayer(player)
                    if l.isEmpty():
                        self.lobbies.remove(l)
                    else:
                        self.send_to_all_in_lobby(player.lobbyID, Message(MessageType.PLAYER_LEAVE, { 'playerID': player.id, 'username': player.username}))
                        self.send_to_all_in_lobby(player.lobbyID, Message(MessageType.LOBBY_STATE, lobby.getLobbyState()))
                        self.send_to_all_in_lobby(player.lobbyID, Message(MessageType.CHAT, {
                            "username": player.username,
                            "variant": player.variant,
                            "text": "Left the lobby."
                        }))

                self.connections.remove(sock)
                del self.socketToPlayer[sock]
                break
        print("Connection removed. Total connections: ", len(self.connections))

    # Given an sid, check if a socket with this sid is connected
    def is_connected(self, sid):
        return sid in self.activeSids

    # Given an socket's sid, return the player associated with it
    def get_player(self, sid):
        return self.sidToPlayer[sid]

    # return the whole mapping of sid -> player
    def get_sid_to_player(self):
        return self.sidToPlayer

    # loop through all sockets, see which one is attached to this player
    def get_socket(self, player: Player):
        for sock in self.connections:
            if self.socketToPlayer[sock] == player:
                return sock
        return None

    # send a message from the server to everyone connected (i.e. all lobbies)
    # This function should probably not be used very often, if at all
    def send_message_to_all(self, message: Message):
        for sock in self.connections:
            sock.emit('message', message.toJSON())

    # send a message from the server to everyone in a specific lobby
    def send_to_all_in_lobby(self, lobbyID, message: Message):
        # loop through all sockets, send this message to all players sharing the same lobby ID
        for sock in self.connections:
            if self.socketToPlayer[sock].lobbyID == lobbyID:
                print(f"Sending message to player {self.socketToPlayer[sock].username} in lobby {lobbyID}")
                sock.emit('message', message.toJSON())
    
    def send_to_player(self, player: Player, message: Message):
        sock = self.get_socket(player)
        if sock is not None:
            sock.emit('message', message.toJSON())
        else:
            warn(colored("Tried to send message to player with no socket", "yellow"))