/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

const header = document.getElementById('head');
const brand = document.getElementById('brandName');
const list = document.querySelectorAll('.user-acct-dtls > ul > li');
const accountNumber = localStorage.getItem('account-number');
const userData = JSON.parse(localStorage.getItem('user-data'));
const { token } = userData;

const h4 = document.createElement('h4');
const { firstName, lastName } = JSON.parse(localStorage.getItem('user-data'));
h4.innerHTML = `Welcome ${firstName} ${lastName}`;
header.append(h4);

const p = document.createElement('p');
p.innerHTML = `<i class="far fa-user"></i>${firstName} ${lastName}`;
brand.after(p);

fetch(`https://infinite-sea-96838.herokuapp.com/api/v1/accounts/${accountNumber}`, {
  method: 'get',
  withCredentials: true,
  credentials: 'include',
  headers: {
    Authorization: `bearer ${token}`,
  },
}).then(res => res.json())
  .then((res) => {
    const { balance, status, type } = res.data;
    const keys = [accountNumber, type, balance, status];
    for (let i = 0; i < list.length; i += 1) {
      list[i].innerHTML = `${list[i].textContent} <span>${keys[i]}</span>`;
    }
  });

fetch(`https://infinite-sea-96838.herokuapp.com/api/v1/accounts/${accountNumber}/transactions`, {
  method: 'get',
  withCredentials: true,
  credentials: 'include',
  headers: {
    Authorization: `bearer ${token}`,
  },
}).then(res => res.json())
  .then((res) => {
    const { balance, status, type } = res.data;
    const keys = [accountNumber, type, balance, status];
    for (let i = 0; i < list.length; i += 1) {
      list[i].innerHTML = `${list[i].textContent} <span>${keys[i]}</span>`;
    }
  });
