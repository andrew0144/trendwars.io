import { ws } from '../socketConfig';
import Message from './Message';
import MessageType from './MessageType';

export function sendCreateLobbyMessage() {
  const msg = new Message(MessageType.CREATE_LOBBY, { data: 'test' });
  ws.emit('message', msg.toJSON());
}

export function sendJoinLobbyMessage(lobbyID: string) {
  const msg = new Message(MessageType.PLAYER_JOIN, {
    data: { lobbyID: lobbyID.toUpperCase() },
  });
  ws.emit('message', msg.toJSON());
}

export function sendUsernameMessage(username: string) {
  const msg = new Message(MessageType.USERNAME, { data: username });
  ws.emit('message', msg.toJSON());
}

export function sendReadyMessage() {
  const msg = new Message(MessageType.READY, { data: 'ready' });
  ws.emit('message', msg.toJSON());
}

export function sendStartGameMessage() {
  const msg = new Message(MessageType.START_GAME, { data: 'start' });
  ws.emit('message', msg.toJSON());
}

export function sendLobbySettings(settings: any) {
  const msg = new Message(MessageType.LOBBY_SETTINGS, { data: settings });
  ws.emit('message', msg.toJSON());
}
