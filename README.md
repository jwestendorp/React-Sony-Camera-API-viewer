# Sony camera api proxy (beta)

React interface for testing sony camera api. Requests are send to the camera via a proxy server to work around CORS during development. 

## Installation

Install with [create-react-app](https://github.com/facebook/create-react-app)


## Usage

#### start up the proxy server:

```js
node server.js
//will start on localhost:5000
```

start react developement server:
```js
npm start
//will start on localhost:3000
```

connect to your sony camera's network.
The interface will now show the available api calls


Requests:
React dev server -> proxy -> Camera

Responses:
Camera -> proxy -> React dev server 

## Notes

this project is still under development. You have to manually change the ip adress to your camera's ip in server.js
