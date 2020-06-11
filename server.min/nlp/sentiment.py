import sys
import jiagu

text = sys.argv[1]

sentiment = jiagu.sentiment(text)
possibility = sentiment[0] == 'positive' and sentiment[1] or 1 - sentiment[1]
print(possibility)
