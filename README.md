# Sony camera api proxy 

React interface for testing sony camera api. Requests are send to the camera via a proxy server to work around CORS during development. 

## Setup

Install with [create-react-app](https://github.com/facebook/create-react-app)


Enter your camera ip in the server file
```js
//  server/index.js
const CAMERA_IP = "Your camera IP";
```

More info on how to find your camera's ip on the [Sony website](https://developer.sony.com/posts/develop-remote-control-apps-for-sony-cameras/)

## Usage

#### start up the proxy server:

```js
npm run server
//will start on localhost:5000
```

#### start react developement server:
```js
npm run react
//will start on localhost:3000
```

connect to your sony camera's network.
The interface will now show the available api calls


Requests:
React dev server -> proxy -> Camera

Responses:
Camera -> proxy -> React dev server 



### This project is still work in progress...
