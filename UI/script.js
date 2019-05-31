/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const nav = document.getElementById('sidebar');
const pageContent = document.getElementById('page-content');
const body = document.getElementById('page');
let history;

const storage = () => {
  const location = window.location.href;
  const url = 'https://williamsohworuka.github.io/Banka-web-app/UI/staff-accountDashboard.html';
  const url2 = 'https://williamsohworuka.github.io/Banka-web-app/UI/admin-dashboard.html';
  if (location === url || url2) {
    history = [];
  }
};
storage();

body.addEventListener('click', (event) => {
  const ul = document.getElementById('down-menu');
  ul.style.display = 'none';
  const last = history[history.length - 1];
  last.nextElementSibling.style.display = 'none';
  last.style.display = 'inline-block';
});

const closeMenu = () => {
  nav.style.width = '0';
  pageContent.style.marginRight = '0';
  pageContent.style.marginLeft = '0';
};

const openMenu = () => {
  nav.style.width = '350px';
  pageContent.style.marginRight = '350px';
  pageContent.style.marginLeft = '-350px';
  pageContent.onfocus = closeMenu;
};

const closeModal = () => {
  document.getElementById('confirmation-modal').style.display = 'none';
};

const openModal = () => {
  document.getElementById('confirmation-modal').style.display = 'block';
};

const openSideNav = () => {
  document.getElementById('icon-nav').style.marginLeft = '-45px';
  document.getElementById('profile-side-nav').style.marginLeft = '0';
  document.getElementById('profile').style.marginLeft = '245px';
  document.getElementById('icon-top-bar').style.left = '251px';
};

const closeSideNav = () => {
  document.getElementById('icon-nav').style.marginLeft = '0';
  document.getElementById('profile-side-nav').style.marginLeft = '-245px';
  document.getElementById('profile').style.marginLeft = '45px';
  document.getElementById('icon-top-bar').style.left = '0';
};

const menu = () => {
  const ul = document.getElementById('drop-down-menu');
  if (ul.style.display === 'block') {
    ul.style.display = 'none';
  } else {
    ul.style.display = 'block';
  }
};

const resetPassword = (obj) => {
  const selectedValue = obj.options[obj.selectedIndex].value;
  if (selectedValue === 'Yes') {
    document.getElementById('old-pswd').style.display = 'block';
    document.getElementById('new-pswd').style.display = 'block';
  } else {
    document.getElementById('old-pswd').style.display = 'none';
    document.getElementById('new-pswd').style.display = 'none';
  }
};

const offset = (el) => {
  const rect = el.getBoundingClientRect();
  const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  return { top: rect.top + scrollTop, left: rect.left + scrollLeft };
};

const updateHistory = (elem) => {
  history.push(elem);
  if (history.length === 2) {
    history.splice(0, 1);
    return true;
  }
};

const dropMenu = (event) => {
  event.stopPropagation();
  const ul = document.getElementById('down-menu');
  const { target } = event;
  const elem = event.currentTarget;
  if (history.length) {
    const last = history[history.length - 1];
    if (last !== elem.nextElementSibling) {
      last.nextElementSibling.style.display = 'none';
      last.style.display = 'inline-block';
    }
  }
  updateHistory(elem);
  const coords = offset(target);
  ul.style.left = `${coords.left}px`;
  ul.style.top = `${coords.top + 12}px`;
  ul.style.display = 'block';
  elem.style.display = 'none';
  elem.nextElementSibling.style.display = 'inline-block';
};

const collapseMenu = (event) => {
  event.stopPropagation();
  const ul = document.getElementById('down-menu');
  ul.style.display = 'none';
  const elem = event.currentTarget;
  elem.style.display = 'none';
  elem.previousElementSibling.style.display = 'inline-block';
};
