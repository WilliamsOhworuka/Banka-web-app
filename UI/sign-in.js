/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const formData = new FormData(document.getElementById('signin-form'));
const submit = document.getElementById('signin-submit');

submit.addEventListener('click', async (event) => {
  event.preventDefault();
  const searchParams = new URLSearchParams();

  const pair = [...formData];
  for (let i = 0; i < pair.length; i += 1) {
    searchParams.append(pair[i][0], pair[i][1]);
  }

  const response = await fetch('https://infinite-sea-96838.herokuapp.com/api/v1/auth/signin', {
    method: 'POST',
    body: searchParams,
  });

  const result = await response.json();
  console.log(result.message);
});
