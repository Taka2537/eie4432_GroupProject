import express from 'express';
import fs from 'fs/promises';
import client from './dbclient.js';

const app = express();

const events = client.db('TrainTicketSellingSystem').collection('events');

async function init_db() {
  try {
    const users = client.db('TrainTicketSellingSystem').collection('events');
    const count = await users.countDocuments();
    if (count === 0) {
      const data = await fs.readFile('./event.json', 'utf-8');
      const eventData = JSON.parse(data);
      const result = await users.insertMany(eventData);
      console.log(`Added ${result.insertedCount} events`);
    }
  } catch (err) {
    console.error('Unable to initialize the database!');
  }
}

init_db().catch(console.dir);

async function update_Events(departureId, departureDate, departureFrom, departureTo, departureTime) {
  try {
    const data = await events.updateOne(
      { departureId },
      {
        $set: {
          departureDate,
          departureFrom,
          departureTo,
          departureTime,
        },
      },
      { upsert: true }
    );

    if (data.upsertedCount === 1) {
      console.log('Added 1 event');
    } else {
      console.log('Added 0 event');
    }
    return true;
  } catch (error) {
    console.error('Unable to update the database!');
    return false;
  }
}

async function fetch_Events(trainID) {
  try {
    const train = await events.findOne({ trainID });
    return train;
  } catch (error) {
    console.log('Unable to fetch from database!');
    return null;
  }
}

async function allevent(){
    try{
    const eventlists = await events.find({}).toArray();
    return eventlists
  } catch (error) {
    console.error('Error',error);
    return null
  }
}
export { update_Events, fetch_Events, allevent };
