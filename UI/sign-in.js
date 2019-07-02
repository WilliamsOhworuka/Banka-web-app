/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const signinForm = document.getElementById('signin-form');
const closeIcon = document.getElementById('close-error');
const errorDiv = document.getElementById('auth-error');
const submit = document.getElementById('signin-submit');

const decodeToken = (token) => {
  const base64Url = token.split('.')[1];
  return JSON.parse(window.atob(base64Url));
};
submit.addEventListener('click', () => {
  submit.style.backgroundColor = '#9b3082';
  submit.value = 'Signing in...';
});

signinForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const formData = new FormData(signinForm);
  const searchParams = new URLSearchParams();

  const pair = [...formData];
  for (let i = 0; i < pair.length; i += 1) {
    searchParams.append(pair[i][0], pair[i][1]);
  }

  fetch('https://infinite-sea-96838.herokuapp.com/api/v1/auth/signin', {
    method: 'post',
    body: searchParams,
  }).then(res => res.json())
    .then((res) => {
      console.log(res);
      if (!res.error) {
        const userData = decodeToken(res.data.token);
        const userType = userData.type;
        const { isAdmin } = userData;

        localStorage.setItem('user-data', JSON.stringify(res.data));
        if (userType === 'staff') {
          location.href = isAdmin ? 'https://williamsohworuka.github.io/Banka-web-app/UI/admin-dashboard.html'
            : 'https://williamsohworuka.github.io/Banka-web-app/UI/staff-accountDashboard.html';
        } else {
          location.href = 'https://williamsohworuka.github.io/Banka-web-app/UI/select-account.html';
        }
      } else {
        submit.value = 'Sign in';
        submit.style.backgroundColor = '#660066';
        errorDiv.style.display = 'block';
      }
    });
});

closeIcon.addEventListener('click', () => {
  errorDiv.style.display = 'none';
});
