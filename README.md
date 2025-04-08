# Text Chat App

A simple text messaging web app with chat room functionality built with React, TypeScript, Socket.io, and Material UI.

## Features

- Create chat rooms with unique codes
- Join existing chat rooms using room codes
- Real-time messaging
- Dark/light mode toggle
- Responsive design
- Auto-scrolling chat
- Copy room code functionality

## Project Structure

The project consists of two main parts:

1. **Client**: React application with TypeScript and Material UI
2. **Server**: Node.js server with Express and Socket.io

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install server dependencies:
   ```
   npm install
   ```
3. Install client dependencies:
   ```
   cd client
   npm install
   ```

### Running the Application

1. Start the server:
   ```
   node server.js
   ```
   or with nodemon for development:
   ```
   npm run dev
   ```

2. Start the client:
   ```
   cd client
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5173`

## How to Use

1. Enter your name and click "Create Room" to create a new chat room
2. Share the generated room code with others
3. Others can join by entering their name and the room code
4. Start chatting!

## Technologies Used

- React
- TypeScript
- Socket.io
- Material UI
- Express
- Vite
