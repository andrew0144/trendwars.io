import pandas as pd
import random

class wordlibrary:
    def __init__(self, library_path):
        self.word_df = pd.read_csv(library_path)
        self.word_list = self.word_df["Word"].tolist()

    def get_word(self):
        return random.choice(self.word_list)


    def add_word(self, word):
        self.word_list.append(word)

    def remove_word(self, word):
        if word in self.word_list:
            self.word_list.delete(word)
    