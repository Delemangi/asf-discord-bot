import sys
from dateparser import parse

date = parse(' '.join(sys.argv[1:]))

print(date.isoformat() if date else 'null', end='')
