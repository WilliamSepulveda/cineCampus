require('dotenv').config();
const express = require('express');
const userRouter = require('./server/router/userRouter.js');
const movieRouter = require('./server/router/PeliculasRouter.js');
const { join } = require('path');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/css', express.static(join(process.env.EXPRESS_STATIC, 'css')));
app.use('/js', express.static(join(process.env.EXPRESS_STATIC, 'js')));
app.use('/storage', express.static(join(process.env.EXPRESS_STATIC, 'storage')));

app.get('/', (req, res) => {
  res.sendFile(join(process.env.EXPRESS_STATIC, 'index.html')); 
});

app.get('/log_in', (req, res) => {
  res.sendFile(join(process.env.EXPRESS_STATIC, 'views', 'log_in.html'));
});

app.get('/create_account', (req, res) => {
  res.sendFile(join(process.env.EXPRESS_STATIC, 'views', 'create_account.html'));
});

app.get('/home_cine', (req, res) => {
  res.sendFile(join(process.env.EXPRESS_STATIC, 'views', 'home_cine.html'));
});

app.get('/cinema_selection', (req, res) => {
  res.sendFile(join(process.env.EXPRESS_STATIC, 'views', 'cinema_selection.html'));
});

app.get('/choose_seat', (req, res) => {
  res.sendFile(join(process.env.EXPRESS_STATIC, 'views', 'choose_seat.html'));
});

app.get('/oder_summary', (req, res) => {
  res.sendFile(join(process.env.EXPRESS_STATIC, 'views', 'oder_summary.html'));
});

app.get('/ticket', (req, res) => {
  res.sendFile(join(process.env.EXPRESS_STATIC, 'views', 'ticket.html'));
});

app.use('/user', userRouter);

app.use('/movies', movieRouter);



app.use((req, res) => {
  res.status(404).json({ message: 'La ruta solicitada no está disponible' });
});

const port = process.env.EXPRESS_PORT;
const host = process.env.EXPRESS_HOST_NAME;

app.listen(port, host, () => {
  console.log(`${process.env.EXPRESS_PROTOCOL}${host}:${port}`);
});
