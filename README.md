TwiThinks Tweet Volume Alert Frontend Service
=============================================
Frontend for TwiThinks tweet-based event detection platform.

key features
------------
- supporting [API Draft 0](https://trello.com/c/YqmLu2fZ/46-api-draft-0)
- websocket (with fallbacks) per-stock feed subscription
- email alert delivery 
- recent tweets cache
- basic backend health monitoring

live instances
--------------
production at http://stock.twithinks.com

development at http://54.235.161.102:8000

use
---
1. clone the repo
2. install dependency ```$ npm install```
3. execute ```$ node app.js``` for development, or ```$ NODE_ENV=production node app.js``` for production.

author
------
Falcon Dai @ TwiThinks
