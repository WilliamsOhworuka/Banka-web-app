import express from 'express';
import bodyParser from 'body-parser';
import authRoute from '../routes/auth.route';
import accountsRoute from '../routes/accounts.route';
import accountRoute from '../routes/account.route';
import transactionRoute from '../routes/transaction.route';
import UserRoute from '../routes/users.routes';

const app = express();

app.get('/', (req, res) => {
  res.json({
    message: 'welcome to Banka',
  });
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/api/v1/accounts', accountsRoute);
app.use('/api/v1/account', accountRoute);
app.use('/api/v1/transactions', transactionRoute);
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/user', UserRoute);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log('Server is listening at 3000'));

export default app;
