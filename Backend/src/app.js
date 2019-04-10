import express from 'express';
import bodyParser from 'body-parser';
import jsonWebToken from 'jsonwebtoken';
import jwt_Decode from 'jwt-decode';

const app = express();

app.post('/api/v1/auth/signup', (req, res) => {
  res.send({});
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log('Server is listening at 3000'));

export default app;
