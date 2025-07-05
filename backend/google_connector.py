from pytrends.request import TrendReq
import pandas as pd

class google_connector:

    def __init__(self, connect_region, category = 0, search_region = "", timeframe = 'today 5-y', gprop = ''):

        #use 'en-US' for english us in connect region
        self.pytrends = TrendReq(hl=connect_region)
        #two character country code denoting which country to search in, defaults to world
        self.search_region = search_region
        #category we want to search in--see codes in documentation, but will default.  can use pytrends.category() to get the possible categories
        self.category = category
        #time frame for search: defaults for 5 years, see other time codes in documentation
        self.timeframe = timeframe
        #gprop refers to which website we want to search, can be youtube, images, etc.
        self.gprop = gprop

    #this method generates a dataframe containing the results for the word list. 
    def get_word_results(self, word_list):
        result_df = self.pytrends.build_payload(word_list, cat = self.category, timeframe = self.timeframe, geo = self.search_region)
        print(result_df)
        result_df = self.pytrends.interest_over_time()
        return result_df


