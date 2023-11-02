import express from 'express'
import { createClient } from 'redis';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3000;

const redisClient = createClient({
  url: 'redis://redis:6379'
});

redisClient.on('error', (err) => {
  console.log('Redis Client Error', err);
});

redisClient.connect((err) => {
    if (err) {
      console.error('Failed to connect to Redis:', err);
    } else {
      console.log('Connected to Redis');
    }
  });

app.use(cors());

app.get('/count_issues', async (req, res) => {
  const value = await redisClient.get('count_issues');
  const parsedValue = JSON.parse(value);
  res.json({ result: parsedValue });
});

app.get('/endpoint2', async (req, res) => {
  const value = await redisClient.get('key2');
  res.json({ result: value });
});

app.get('/endpoint3', async (req, res) => {
  const value = await redisClient.get('key3');
  res.json({ result: value });
});

app.get('/endpoint4', async (req, res) => {
  const value = await redisClient.get('key4');
  res.json({ result: value });
});

app.get('/endpoint5', async (req, res) => {
  const value = await redisClient.get('key5');
  res.json({ result: value });
});

app.get('/endpoint6', async (req, res) => {
  const value = await redisClient.get('key6');
  res.json({ result: value });
});

app.get('/endpoint7', async (req, res) => {
  const value = await redisClient.get('key7');
  res.json({ result: value });
});

app.get('/endpoint8', async (req, res) => {
  const value = await redisClient.get('key8');
  res.json({ result: value });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
