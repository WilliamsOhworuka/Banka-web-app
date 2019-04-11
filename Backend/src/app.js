import express from 'express';
import bodyParser from 'body-parser';
import authRoute from '../routes/auth.route';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded(false));
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/account',)

const port = process.env.PORT || 3000;
app.listen(port, () => console.log('Server is listening at 3000'));

export default app;
