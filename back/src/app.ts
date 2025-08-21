import express from 'express';
import cors from 'cors';
import routes from './routes/routes.js'
import routerAuth from './routes/auth.js';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.use('/api', routes);
app.use('/auth', routerAuth);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
