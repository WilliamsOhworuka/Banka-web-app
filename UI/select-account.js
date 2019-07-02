/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const userData = JSON.parse(localStorage.getItem('user-data'));
const { email } = userData;
const { token } = userData;
const ul = document.getElementById('acct-list');

fetch(`https://infinite-sea-96838.herokuapp.com/api/v1/user/${email}/accounts`, {
  method: 'get',
  withCredentials: true,
  credentials: 'include',
  headers: {
    Authorization: `bearer ${token}`,
  },
}).then(res => res.json())
  .then((res) => {
    for (let i = 0; i < res.accounts.length; i += 1) {
      const li = document.createElement('li');
      if (i === 0) {
        li.setAttribute('class', 'first');
      }
      li.innerHTML = `<a href="javascript:void(0);" >${res.accounts[i].accountnumber}<i class="fas fa-angle-right"></i></a>`;
      ul.append(li);
      li.addEventListener('click', () => {
        localStorage.setItem('account-number', li.textContent);
        window.location.href = 'http://localhost:5500/UI/account-dashboard.html'
      });
    }
  });
