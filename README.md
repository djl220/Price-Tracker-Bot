# RuneScape Price Checker

Runescape is an online game, and has a market known as the "Grand Exchange". They have an API for the Grand Exchange, which contains helpful data like current price and trends. This program is a Discord bot that I wrote to pull and manipulate data from this API
However, to get more accurate data for making a profit, my bot collects data from text channels in the Discord server and stores them in a MongoDB cloud database and can pull that data at any time
Using the collected data, the bot can also map a chart of price trends from this private data and return it in the form of a Discord embed
The server also has a private Google Doc document, which contains more information, such as project margins, and my bot can parse the live data from the document and use it in its reply

You can ask the bot to create either a 6 hour or 24 hour chart using the commands !6h and !24h respectively, using the item name as a parameter
This feature uses the private data and creates a virtual DOM, draws the chart on the DOM, exports it to a png, sends it as a reply, then deletes the temporary chart from the local machine
