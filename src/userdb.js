import fs from 'fs/promises';
import client from './dbclient.js';
import express from 'express';

const app = express();

const users = client.db('TrainTicketSellingSystem').collection('users');

async function init_db() {
  try {
    const users = client.db('TrainTicketSellingSystem').collection('users');
    const count = await users.countDocuments();
    if (count === 0) {
      const data = await fs.readFile('./users.json', 'utf-8');
      const usersData = JSON.parse(data);
      const result = await users.insertMany(usersData);
      console.log(`Added ${result.insertedCount} users`);
    }
  } catch (err) {
    console.error('Unable to initialize the database!');
  }
}

init_db().catch(console.dir);

async function validate_user(username, password) {
  try {
    if (!username || !password) {
      return false;
    }

    const user = await users.findOne({ username, password });

    if (user) {
      return {
        _id: user._id,
        username: user.username,
        password: user.password,
        role: user.role,
        enabled: user.enabled,
      };
    } else {
      return false;
    }
  } catch (error) {
    console.log('Unable to fetch from database!');
    return false;
  }
}

async function update_user(username, password, role, enabled) {
  try {
    const data = await users.updateOne(
      { username },
      {
        $set: {
          password,
          role,
          enabled,
        },
      },
      { upsert: true }
    );

    if (data.upsertedCount === 1) {
      console.log('Added 1 user');
    } else {
      console.log('Added 0 user');
    }
    return true;
  } catch (error) {
    console.error('Unable to update the database!');
    return false;
  }
}
async function fetch_user(username) {
  try {
    const user = await users.findOne({ username });
    return user;
  } catch (error) {
    console.log('Unable to fetch from database!');
    return null;
  }
}

async function username_exist(username) {
  try {
    const result = await fetch_user(username);

    if (result === null) {
      return false;
    } else {
      return true;
    }
  } catch (error) {
    console.log('Unable to fetch from database!');
    return false;
  }
}

export { validate_user, update_user, fetch_user, username_exist };
