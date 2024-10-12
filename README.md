# Crossword Puzzle App

[Demo](#demo)

# About

A **crossword puzzle** web application built using Next.js. Players can enjoy singleplayer mode with predefined puzzles, create and join random multiplayer games, or create their own crossword puzzles.

## Game

In the current version of the game, the **board** consists of an 8x8 grid, where the crossword puzzles follow the traditional _arrow crossword_ format. Each **question** occupies a square on the grid, and **answers** can be entered **letter by letter**, either downwards or to the right. Multiple questions are allowed, with a tile serving both the downwards and rightward questions.

Apart from the traditional format, the **question type** can be one of three: **Emoji**, **Color**, or **Text**.

An **answer** can be entered **letter by letter**, where in the current version of the game, clicking on a tile allows you to choose from 6 different letters, with only one being the correct answer. Each correct answer is **worth 1 point**, while incorrect answers **subtract 2 points**.

When all questions have been answered, the players' scores are displayed, and they have the option to start a new game.

## Technologies used

| Technology  | Version |
| ----------- | ------- |
| Next.js     | 14.2.10 |
| React       | 18      |
| Typescript  | 5       |
| SocketIO    | 4.7.5   |
| Prisma      | 5.19.1  |
| PostgreSQL  | 16      |
| TailwindCSS | 4.7.5   |

## Demo

[Try it out](https://seal-app-vhny2.ondigitalocean.app/)

## Work In Progress ⚠️

Please note that this project was created for personal demo purposes. It is in the early stages of development, so some parts may be non-functional, minimally functional, or awaiting modification.
