import express from 'express';
import bodyParser from 'body-parser';
import authRoute from '../routes/auth.route';
import accountRoute from '../routes/accounts.route';
import statusUpdteRoute from '../routes/account.route';
import transactionRoute from '../routes/transaction.route';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/api/v1/accounts', accountRoute);
app.use('/api/v1/account', statusUpdteRoute);
app.use('/api/v1/transactions', transactionRoute);
app.use('/api/v1/auth', authRoute);


const port = process.env.PORT || 3000;
app.listen(port, () => console.log('Server is listening at 3000'));

export default app;
