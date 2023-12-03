import express from 'express';
import fs from 'fs/promises';
import multer from 'multer';
import { allevent, update_Events } from './events.js';

const users = new Map();
const events = new Map();

async function init_userdb() {
  console.log(users);
  if (users.size > 0) return;
  try {
    const userData = await fs.readFile('./users.json', 'utf-8');
    const usersArray = JSON.parse(userData);
    usersArray.forEach((user) => {
      users.set(user.username, user);
    });
    console.log(users);
  } catch (error) {
    console.error('Error reading users.json:', error);
  }
}

async function validate_user(username, password) {
  console.log(users.has(username), 'u' + username, 'p' + password);
  if (!users.has(username)) return false;
  const user = users.get(username);
  if (user.password !== password) return false;
  return {
    username: user.username,
    role: user.role,
    enabled: user.enabled,
  };
}

const route = express.Router();
const form = multer();

route.use(express.urlencoded({extended:true}));
route.use(express.json());

route.post('/login', form.none(), async (req, res) => {
  if (users.size === 0) {
    await init_userdb();
  }
  req.session.logged = false;
  console.log(req.body);

  const user = await validate_user(req.body?.username, req.body?.password);

  if (!user.enabled) {
    const message =
      user && !user.enabled ? `User "${user.username}" is currently disabled` : 'Incorrect username and password';
    res.status(401).json({ status: 'failed', message });
  } else {
    req.session.username = user.username;
    req.session.role = user.role;
    req.session.logged = true;
    res.json({
      status: 'success',
      user: {
        username: user.username,
        role: user.role,
      },
    });
  }
});

route.post('/logout', (req, res) => {
  if (req.session.logged) {
    req.session.destroy();
    res.end();
  } else {
    res.status(401).json({ status: 'failed', message: 'Unauthorized' });
  }
});

route.get('/me', (req, res) => {
  if (req.session.logged) {
    const user = users.get(req.session.username);
    res.json({
      status: 'success',
      user: {
        username: user.username,
        role: user.role,
      },
    });
  } else {
    res.status(401).json({ status: 'failed', message: 'Unauthorized' });
  }
});

async function update_user(username, password, role) {
  const enabled = true;

  users.set(username, { username, password, role, enabled });

  const userjson = [];
  users.forEach((user) => {
    userjson.push({
      username: user.username,
      password: user.password,
      role: user.role,
      enabled: user.enabled,
    });
  });

  try {
    await fs.writeFile('./users.json', JSON.stringify(userjson, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Error writing to users.json:', error);
    return false;
  }
}

route.post('/register', form.none(), async (req, res) => {
  if (users.size === 0) {
    await init_userdb();
  }

  const { username, password, role } = req.body;

  if (!username || !password) {
    return res.status(400).json({ status: 'failed', message: 'Missing fields' });
  }

  if (username.length < 3) {
    return res.status(400).json({ status: 'failed', message: 'Username must be at least 3 characters' });
  }

  if (users.has(username)) {
    return res.status(400).json({ status: 'failed', message: `Username ${username} already exists` });
  }

  if (password.length < 8) {
    return res.status(400).json({ status: 'failed', message: 'Password must be at least 8 characters' });
  }

  const success = await update_user(username, password, role);

  if (success) {
    res.json({
      status: 'success',
      user: {
        username,
        role,
      },
    });
  } else {
    res.status(500).json({ status: 'failed', message: 'Account created but unable to save into the database' });
  }
});




route.post('/trainInfo', form.none(), async (req, res) => {
  const { departureDate, departureFrom, departureTo, departureTime, departureId } = req.body;

  const success = await update_Events(departureId, departureDate, departureFrom, departureTo, departureTime);

  if (success) {
    res.json({
      status: 'success',
    });
  } else {
    res.status(500).json({ status: 'failed', message: 'Events updated but unable to save into the database' });
  }
});

route.get('/trainInfo', (req, res) => {
  if (req.session.success) {
    const user = users.get(req.session.username);
    res.json({
      status: 'success',
      user: {
        username: user.username,
        role: user.role,
      },
    });
  } else {
    res.status(401).json({ status: 'failed', message: 'Unauthorized' });
  }
});
route.get('/allevents',form.none(), async(req, res)=>{
  try {
    const eventlists = await allevent();
    res.json(eventlists);
  } catch (error) {
    console.log('Error',error);
  }
})

route.get('testing', async(req,res)=>{
  res.json("this is test");
})

route.get('/allEvents',form.none(), async(req, res)=>{
  try {
  const result = await allevent()
  console.log(result[0])
   res.json(result);
  } catch (error) {
    console.log('Error',error);
  }
})


export default route;
