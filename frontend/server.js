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

app.get('/check_status', async (req, res) => {
  const value = await redisClient.get('parsers_completed');
  const status = value === "completed" ? "completed" : "incomplete";

  res.json({ status });
});

app.get('/github_contributors', async (req, res) => {
  const value = await redisClient.get('github_contributors');
  const parsedValue = JSON.parse(value);
  res.json({ result: parsedValue });
});

app.get('/issue_comments', async (req, res) => {
  const value = await redisClient.get('issue_comments');
  const parsedValue = JSON.parse(value);
  res.json({ result: parsedValue });
});

app.get('/closed_issues', async (req, res) => {
  const value = await redisClient.get('closed_issues');
  const parsedValue = JSON.parse(value);
  res.json({ result: parsedValue });
});

app.get('/approved_issues', async (req, res) => {
  const value = await redisClient.get('approved_issues');
  const parsedValue = JSON.parse(value);
  res.json({ result: parsedValue });
});

app.get('/count_issues', async (req, res) => {
  const value = await redisClient.get('count_issues');
  const parsedValue = JSON.parse(value);
  res.json({ result: parsedValue });
});

app.get('/issue_type', async (req, res) => {
  const value = await redisClient.get('issue_type');
  const parsedValue = JSON.parse(value);
  res.json({ result: parsedValue });
});

app.get('/issue_stats', async (req, res) => {
  const value = await redisClient.get('issue_stats');
  const parsedValue = JSON.parse(value);
  res.json({ result: parsedValue });
});

app.get('/labels_stats', async (req, res) => {
  const value = await redisClient.get('labels_stats');
  const parsedValue = JSON.parse(value);
  res.json({ result: parsedValue });
});

app.get('/issue_rewards', async (req, res) => {
  const value = await redisClient.get('issue_rewards');
  const parsedValue = JSON.parse(value);
  res.json({ result: parsedValue });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
