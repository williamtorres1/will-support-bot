import express from 'express';
import User from '@models/User';

const app = express();

app.get('/', (request, response) => {
  return response.json({ message: 'Hello World' });
});

app.listen(3333, () => {
  console.log(`Backend started on port 3333!`);
});
