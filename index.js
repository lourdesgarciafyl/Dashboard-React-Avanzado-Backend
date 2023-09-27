import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import morgan from 'morgan';
import path from 'path';
import fileUpload from 'express-fileupload';

import './src/database/dbConnection';
import productsRouter from './src/routes/products.routes';
import categoriasRouter from './src/routes/categorias.routes';
import usersRouter from './src/routes/users.routes';
import salesRouter from './src/routes/sales.routes';

dotenv.config();
const app = express();
app.set('PORT', process.env.PORT || 4010);
app.listen(app.get('PORT'), () => {
  console.log('Estoy en el puerto ' + app.get('PORT'));
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, `/public`)));
// Note that this option available for versions 1.0.0 and newer.
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: '/upload',
  })
);

app.use(`/api/products`, productsRouter);
app.use(`/api/categorias`, categoriasRouter);
app.use(`/api/auth`, usersRouter);
app.use(`/api/sales`, salesRouter);
