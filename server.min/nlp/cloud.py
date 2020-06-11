from os import path
import jieba
import jieba.posseg as pseg
from PIL import Image
import numpy as np
from wordcloud import WordCloud, ImageColorGenerator
import collections

d = path.dirname(__file__)
text = open(path.join(d, 'history.txt'), encoding='utf-8').read()

jieba.enable_paddle()
words = pseg.cut(text, use_paddle=True)
words_filter = []
for word, flag in words:
  if flag not in ['m', 'c', 'f', 'ad', 'q', 'u', 'r', 'xc', 'p', 'w'] and word not in ['是', '不是', '又', '还']:
  	words_filter.append(word)
word_counter = collections.Counter(words_filter)

qm = np.array(Image.open(path.join(d, 'QingMang_mask.jpg')))
wordcloud = WordCloud(
  mask=qm,
  font_path=path.join(d, 'msyh.ttf'),
  mode='RGBA',
  background_color="RGBA(255,255,255,0)"
)
wordcloud.generate_from_frequencies(word_counter)
wordcloud.to_file(path.join(d, 'cloud.png'))

print()
