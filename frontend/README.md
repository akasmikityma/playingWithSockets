# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```

the data that the clients are sent has the name of the roomname and then just map them in the chats by their name and when any specific client is clicked then find the roomname of that client and send the message JOIN_ROOM with that roomname and its done ..

done with the "getting into room"

fixes -> 
1 dont show the user there in the chat options 
2 can i make any notification like thing whenever there is a new message or state update 
3 


//send some data of the user along with the room name and then user the transaction method to first create a room and then have that that user 
//as a client there and the user enters the room and sees all the other rooms except the one that the user itself is in 


or 
//have all the user there in the dashboard section or whatever and then the user can choose to have chat with anyone and on that point only a room will be created and the messages be sent 
//all the rooms that the user is in .. user can see and when the user wants to have chat to a person it has already have in room the system must not create another room but will open that previous room instead 