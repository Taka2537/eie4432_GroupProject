import mongostore from 'connect-mongo';
import express from 'express';
import session from 'express-session';
import client from './dbclient.js';
import login from './login.js';
import path from 'path';

const app = express();

app.use(
  session({
    secret: 'TrainTicketSellingSystem',
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true },
  })
);

app.get('/', (req, res) => {
  if (req.session.logged) {
    res.redirect('/index.html');
  } else {
    res.redirect('/login.html');
  }
});

app.use('/auth', login);

app.use('/', express.static(path.join(process.cwd(), '/static')));
const port = 3000;
app.listen(port, () => {
  const currentDate = new Date().toLocaleString('en-US', {
    timeZone: 'Asia/Hong_Kong',
  });
  console.log(`Current time in HKT: ${currentDate}`);
  console.log(`Server started at http://127.0.0.1:${port}`);
});

app.use(
  session({
    secret: 'TrainTicketSellingSystem',
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true },
    store: mongostore.create({
      client,
      dbName: 'TrainTicketSellingSystem',
      collectionName: 'session',
    }),
  })
);
