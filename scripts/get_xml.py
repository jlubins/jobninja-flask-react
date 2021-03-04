import requests

url = 'https://s3.eu-central-1.amazonaws.com/jobninja-backend-feeds-prod/d075e989-1a00-409f-adf9-d14ddbaf4198/jobs_feed.xml'
r = requests.get(url, allow_redirects=True)

open('jobs_feed.xml', 'wb').write(r.content)