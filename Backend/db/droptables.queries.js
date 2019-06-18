import '@babel/polyfill';
import database from './index';

const text = 'drop table users,accounts,transactions';

const drop = async () => {
  try {
    await database.query(text);
  } catch (err) {
    console.error(err);
  }
};

drop();
