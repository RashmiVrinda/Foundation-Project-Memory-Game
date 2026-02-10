This project is a browser-based Memory Card Game built using HTML, CSS, and JavaScript as part of the HYF Foundation Project.
The goal of the game is to test the player’s memory by matching pairs of cards in a grid.

The game displays a set of cards placed face down. Each card contains an emoji symbol. When a card is clicked, it flips with an animation to reveal its symbol. The player can flip two cards at a time. If the symbols match, the cards remain revealed; if they do not match, they flip back after a short delay.

The application includes:

A dynamic card grid rendered using JavaScript

Card flip animations implemented with CSS

A move counter to track player actions

A timer that starts on the first card flip

Core matching logic to control gameplay flow

The project also uses a Node.js backend with a SQL database to store card data. The frontend retrieves the card information through an API built with Node.js, allowing the game to render cards dynamically from the backend instead of relying only on hardcoded data.

This project focuses on DOM manipulation, event handling, API data fetching, and clean frontend architecture, while following pair programming and Agile planning practices using a Trello board.
