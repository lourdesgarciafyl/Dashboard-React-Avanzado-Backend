import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import morgan from 'morgan';
import path from 'path';
import fileUpload from 'express-fileupload';

import './src/database/dbConnection';
import productsRouter from './src/routes/products.routes';
import categoriesRouter from './src/routes/categories.routes';
import usersRouter from './src/routes/users.routes';
import salesRouter from './src/routes/sales.routes';
import notificationsRouter from './src/routes/notifications.routes';
//sockets.io
// import createServer from "http";
// import Server from "socket.io";
const { createServer } = require("http");
const { Server } = require("socket.io");

dotenv.config();
const app = express();
app.set('PORT', process.env.PORT || 4010);
/* app.listen(app.get('PORT'), () => {
  console.log('Estoy en el puerto ' + app.get('PORT'));
}); */

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, `/public`)));
// Note that this option available for versions 1.0.0 and newer.
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp',
  })
);

app.use(`/api/products`, productsRouter);
app.use(`/api/categories`, categoriesRouter);
app.use(`/api/auth`, usersRouter);
app.use(`/api/sales`, salesRouter);
app.use(`/api/notifications`, notificationsRouter);

const httpServer = createServer(app);
const io = new Server(httpServer, { 
    cors: {
        origin: "http://localhost:5173"
    }    
});

io.on("connection", (socket) => {
  console.log('Cliente conectado')
});

app.set('socketio', io);// aqui asignas el socket global

httpServer.listen(app.get('PORT'), () => {
  console.log('Estoy en el puerto ' + app.get('PORT'))
});