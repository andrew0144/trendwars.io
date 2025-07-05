import warnings

import ConnectionManager
from Message import Message, MessageType
import time
from Player import Player
from wordlibrary import wordlibrary
#from backend.wordlibrary import wordlibrary
from google_connector import google_connector
from termcolor import colored
import os
import Lobby
import threading
from threading import Thread
import time
import random


c = threading.Condition()
numberOfTrendsAPICalls = 0
numberOfTrendsAPISuccesses = 0


class Game:
    def __init__(self, players, maxTurns, timeLimit, wordGeneration, CM: ConnectionManager, lobby: Lobby):
        # also need to implement a turn timer at some point so turns don't just end when everyone submits
        threading.Thread.__init__(self)
        self.players = players
        self.turn = 0
        self.curWord = ""
        self.scores = {} # map each player to their score
        self.wordSubmissions = {} # map each player to their submitted word. Is cleared and re-populated every turn
        self.maxTurns = maxTurns
        self.wordGeneration = 'default' # default word generation method
        self.timeLimit = -1 # default time limit for each turn
        self.readyForNextTurn = {} # Once the game has started, all players start as ready
        self.gameEnded = False
        self.turnActive = False
        self.turnStart = False
        self.gameHistory = [] # list of all turns in the game, each turn is a dict with player submissions and scores

        #dictionary to hold the ranks of each player
        self.playerRank = {}
        # interesting game statistics that can be displayed at the end of the game
        self.stats = {
            'best-word': 'N/A',
            'worst-word': 'N/A',
        }
        self.CM = CM
        self.lobby = lobby

        #self.countdown = countdown
        #values hardcoded in, can implement so that users can configure values here.
        self.connector = google_connector(connect_region = 'en-US', search_region = 'US', timeframe = 'today 12-m', gprop = '')

        #this creates an object that allows interface with the list of words:
        self.wordlibrary = wordlibrary(os.getcwd() + "/gamedata/most-common-nouns-english.csv")

        # initialize all player scores to 0 and set all players as not ready for next turn
        #intializes player ranks to 0
        for player in players:
            self.scores[player] = 0
            self.readyForNextTurn[player.id] = False
            self.playerRank[player] = 0
        #self.t1 = Thread(target = timer)

        
        self.startNewTurn()

    def getPointsForTheirWord(self):
        return self.pointsForTheirWord

    def getPlayerScore(self, player: Player):
        return self.scores[player]

    # clear previous submissions and generate new starting word at the beginning of each turn
    def startNewTurn(self):
        for player in self.players:
            player.guessedWord = None
        self.turn += 1
        self.curWord = self.generateStartingWord()
        self.pointsForTheirWord = {}
        self.wordSubmissions = {}
        self.lobby.count = 0

        if self.timeLimit > 0:
            self.start_turn_timer(duration=self.timeLimit)


    # choose a word for players to complete
    def generateStartingWord(self) -> str:
        return self.wordlibrary.get_word()


    # when a player submits a word in a given turn, remember it 
    def processPlayerSubmission(self, player: Player, submission: str) -> int:
        if self.wordSubmissions.get(player) is not None:
            warnings.warn(colored(f'Player {player.id} has already submitted a word for this turn. Their previous submission was {self.wordSubmissions[player]} and their new submission is {submission}. The new submission will be ignored.', 'yellow'))
            return -1
        for _, word in self.wordSubmissions.items():
            if word == submission:
                warnings.warn(colored(f'Player submitted word someone else already submitted', 'yellow'))
                return -2
        self.wordSubmissions[player] = submission
        player.guessedWord = submission

        return 1
        

    # Once all players have submitted a word, submit to the Trends API and update scores accordingly 
    #TODO: If a player puts a word that is like 0 on PyTrends, results[word] gives a keyerror. Need to error handle that.
    def evaluateSubmissions(self):
        global numberOfTrendsAPICalls
        global numberOfTrendsAPISuccesses
        self.connector = google_connector(connect_region = 'en-US', search_region = 'US', timeframe = 'today 12-m', gprop = '')
        #right now, the command returns the "max" search value of the input words
        numberOfTrendsAPICalls += 1
        try:
            results = self.connector.get_word_results(self.wordSubmissions.values()).max()
            for player, submission in self.wordSubmissions.items():
                self.scores[player] += results[submission]
                player.pointInc = int(results[submission])
                if (int(self.scores[player]) > player.mostPointsFromWord):
                    player.bestWord = submission
                player.score = self.scores[player] # redundant, eventually we should switch over to exclusively using the score field rather than the map
                self.pointsForTheirWord[player] = results[submission]
            numberOfTrendsAPISuccesses += 1
        except Exception as e: #if 429 error, everyone gets nothing
            print(e)
            warnings.warn(colored('429 error, turn effectively being skipped. Everyone gets random amount.', 'yellow'))
            for player, submission in self.wordSubmissions.items():
                randomAmount = random.randint(0, 100)
                self.scores[player]  += randomAmount
                player.pointInc = randomAmount
                self.pointsForTheirWord[player] = randomAmount
                if (int(self.scores[player]) > player.mostPointsFromWord):
                    player.bestWord = submission
                player.score = self.scores[player]
        self.playerRank = {key: rank for rank, key in enumerate(sorted(self.scores, key=self.scores.get, reverse=True), 1)}
        self.turnActive = True
        self.endTurn()

    # After all players have submitted their words and they've been submitted to the Trends API, alert those in the lobby on how everyone did
    def getSubmittedWords(self):
        return self.wordSubmissions

    # if all players have submitted, evaluate the submissions 
    # send messsage to everyone connected to this lobby that this player has submitted a word
    def everyoneHasSubmitted(self):

        return len(self.wordSubmissions) == len(self.players)

    def gameShouldEnd(self):
        return self.turn == self.maxTurns
    
    def scoresToJSON(self):
        scores = {}
        for player, score in self.scores.items():
            scores[player.id] = int(score)
        return scores
    
    def wordSubmissionsToJSON(self):
        submissions = {}
        for player, word in self.wordSubmissions.items():
            submissions[player.id] = word
        return submissions

    def endTurn(self):
        self.gameHistory.append({
            'turn': self.turn,
            'curWord': self.curWord,
            'submissions': self.wordSubmissionsToJSON(),
            'scores': self.scoresToJSON()
        })
        for player in self.players:
            self.readyForNextTurn[player.id] = False
            
        #TODO: set 10 sec countdown before next turn starts. Since we don't have a timer yet, just go to next turn immediately
        #if 10 sec timer is done
        self.prepareNextRound()
        warnings.warn(colored(f'Current API Success Rate: {numberOfTrendsAPISuccesses / numberOfTrendsAPICalls}', 'green'))

    def prepareNextRound(self):
        if (self.gameShouldEnd()):
            self.endGame()
        else:
            self.startNewTurn()
            self.CM.send_to_all_in_lobby(self.lobby.id, Message(MessageType.LOBBY_STATE, self.lobby.getLobbyState()))

    def endGame(self):
        self.CM.send_to_all_in_lobby(self.lobby.id, Message(MessageType.GAME_ENDED, {}))
        results = []
        for player, rank in self.playerRank.items():
            player.rank = self.playerRank[player]
            results.append(player.toJSON()) #appended in order of rank
        self.CM.send_to_all_in_lobby(self.lobby.id, Message(MessageType.RESULTS, {
            "scores": results,
            "gameHistory": self.gameHistory,
            }))


    def processReadyForNextRound(self, player: Player):
        if self.wordSubmissions.get(player) is None:
            warnings.warn(colored(f'Player {player.id} has readied up for the next round, but has not submitted a word for the current round. This request will be ignored.', 'yellow'))
            return
        self.readyForNextTurn[player.id] = True
        if (self.allReadyForNextTurn() or self.turnActive == False):
            self.startNewTurn()

    def allReadyForNextTurn(self):
        self.lobby.newTurn = False
        for player, status in self.readyForNextTurn.items():
            if not status:
                return False
        return True

    def setGameOver(self):
        self.gameEnded = True 

    # TODO: Confirm this functions properly if the turn advances from everyone submitting.
    def start_turn_timer(self, duration=10):
        def timer_task():
            remaining_time = duration
            while remaining_time > 0:
                self.CM.send_to_all_in_lobby(self.lobby.id, Message(MessageType.TURN_TIMER_TICK, {'time_left': remaining_time}))
                self.CM.socketio.sleep(1)  
                remaining_time -= 1

            # Not actually moving onto next turn until I test this more.
            if not self.gameEnded:
                warnings.warn(colored(f'Turn would have automatically moved on here.', 'green'))
                # self.evaluateSubmissions()
                self.CM.send_to_all_in_lobby(self.lobby.id, Message(MessageType.TURN_TIMER_EXPIRED, {'message': 'Turn timer expired! Submissions are now closed.'}))
                # self.prepareNextRound()

        self.CM.socketio.start_background_task(target=timer_task)


    def __str__(self):
        return f'Game: Current Turn: {self.turn}, current starting word: {self.curWord}, current scores: {self.scores}'
