from Lobby import DEFAULT_LOBBY_SETTINGS, Lobby 
from Player import Player 
from Message import MessageType, Message
import ConnectionManager
import warnings
from termcolor import colored

warnings.simplefilter('always', UserWarning)

def handlePlayerUpdateMsg(player: Player, username: str, variant: str, CM: ConnectionManager):
    player.username = username
    player.variant = variant
    CM.send_to_player(player, Message(MessageType.PLAYER_STATE, player.toJSON()))

def handlePlayerJoinMsg(player, CM: ConnectionManager, lobbies, lobbyID):
    if player.lobbyID is not None:
        warnings.warn(colored("Player already in a lobby. Not handling request.", "yellow"))
    else:
        for lobby in lobbies:
            if lobby.id == lobbyID:
                if lobby.size() >= lobby.maxPlayers:
                    CM.send_to_player(player, Message(MessageType.LOBBY_FULL, {'data': 'Lobby is full'}))
                    return
                lobby.addPlayer(player)
                player.lobbyID = lobby.id
                if player.username == '':
                    player.username = 'Player ' + str(lobby.size())
                CM.send_to_player(player, Message(MessageType.LOBBY_JOINED, {"lobbyID": lobby.id, "lobby_state": lobby.getLobbyState()}))
                CM.send_to_all_in_lobby(lobbyID, Message(MessageType.CHAT, {
                    "username": player.username,
                    "variant": player.variant,
                    "text": "Joined the lobby."
                }))
                CM.send_to_all_in_lobby(lobbyID, Message(MessageType.LOBBY_STATE, lobby.getLobbyState()))
                warnings.warn(colored(f"Sending lobby settings: {lobby.gameSettings}", "yellow"))
                if lobby.gameSettings != DEFAULT_LOBBY_SETTINGS:
                    CM.send_to_player(player, Message(MessageType.LOBBY_SETTINGS_UPDATED, lobby.gameSettings))
                    CM.send_to_player(player, Message(MessageType.CHAT, {
                        "username": 'System',
                        "variant": 'beam',
                        "text": "Lobby settings updated."
                    }))
                return
        CM.send_to_player(player, Message(MessageType.LOBBY_DOESNT_EXIST, {'data': 'bruh moment'}))
        warnings.warn(f"No lobby with ID {lobbyID} exists. Not handling request.")

def handleCreateLobbyMsg(msg, lobbyCreator, sidToPlayer, sid, lobbies, newID, CM):
    if lobbyCreator == None:
        warnings.warn(colored("Unknown socket tried to create lobby. No player associated with the socket. Not handling request.", "yellow"))
        return

    lobby = Lobby(newID, CM)
    lobbies.append(lobby)
    player = sidToPlayer[sid]
    lobby.addPlayer(player)
    player.lobbyID = lobby.id
    player.host = True
    if player.username == '':
        print("here")
        player.username = 'Player ' + str(lobby.size())
    CM.send_to_player(player, Message(MessageType.LOBBY_CREATED, {"lobbyID": lobby.id, "lobby_state": lobby.getLobbyState()})) # Seems like frontend isn't set up such that the page changes if this isn't sent
    CM.send_to_all_in_lobby(lobby.id, Message(MessageType.LOBBY_STATE, lobby.getLobbyState()))