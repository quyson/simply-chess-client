# Simply Chess
This repository contains a simple web-based Chess application built using React, Node.js, Socket.IO, and the chess.js library. The application allows users to play Chess in real-time with another player. It includes features such as creating a new game, joining an existing game, making moves, and handling game outcomes.

### Server Link
https://github.com/quyson/simply-chess-server

## Technologies Used
React: A JavaScript library for building user interfaces.
Node.js: A JavaScript runtime for server-side development.
Socket.IO: A library for enabling real-time, bidirectional, and event-based communication.
chess.js: A JavaScript chess library for chess move generation, validation, and more.
react-chessboard: A React component for rendering a chessboard.

## Application Structure
The project is organized into three main components:

### App Component (App.tsx):
Manages the overall application structure, routing, and renders different components based on routes.

### ChessLogic Component (ChessLogic.tsx):
Manages the game logic, including moves, turns, and game outcomes.
Uses the chess.js library to represent and manipulate the game state.
Communicates with the server using Socket.IO for real-time updates.

### ChessRoom Component (ChessRoom.tsx):
Handles the setup of the game, including creating and joining game rooms.
Manages the connection to the Socket.IO server and handles events like creating new games, joining games, and starting games.

### Redux Store (configureStore.ts)
The configureStore file sets up the Redux store by combining multiple reducers using the combineReducers function. In this case, the store includes the user slice, which is responsible for managing the current user's information.

The store is created using configureStore from the Redux Toolkit. The RootState type is exported to provide type information for selectors or other parts of the application.

### User Slice (userSlice.ts)
The userSlice file defines a Redux slice named "user." It includes the initial state, which has a currentUser field set to null. The setCurrentUser reducer is defined to update the currentUser field in response to actions.

### Login Component (Login.tsx)
The Login component handles user authentication by sending a POST request to the server when the user submits their credentials. If successful, it stores the authentication token and updates the Redux store with the current user information. It then navigates the user to the chess room.

### Register Component (Register.tsx)
The Register component is responsible for user registration. It ensures that the entered passwords match before sending a POST request to the server. If the registration is successful, it navigates the user back to the login page.

Both components use React hooks (useState, useEffect) to manage local component state and side effects.

## Additional Notes
The application uses Socket.IO for real-time communication between players. Ensure that the server is running and accessible for proper functionality.
The Redux store is used to manage the state of the currently logged-in user across components.
Axios is employed for making HTTP requests to the server for login and registration.
Error handling is implemented for password mismatch during registration.
Feel free to explore and modify the code to add more features, improve functionality, or customize the UI.
Enjoy playing Chess in this simple web application!
