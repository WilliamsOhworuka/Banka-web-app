/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const nav = document.getElementById('sidebar');
const pageContent = document.getElementById('page-content');


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
  document.getElementById('profile-side-nav').style.display = 'block';
  document.getElementById('acct-brand').style.display = 'none';
  document.getElementById('profile').style.marginLeft = '245px';
  document.getElementById('icon-top-bar').style.left = '251px';
};

const mobileOpenSideNav = () => {
  document.getElementById('profile-side-nav').style.display = 'block';
  document.getElementById('profile').style.marginLeft = '245px';
  document.getElementById('icon-top-bar').style.left = '251px';
};

const closeSideNav = () => {
  document.getElementById('icon-nav').style.marginLeft = '0';
  document.getElementById('profile-side-nav').style.display = 'none';
  document.getElementById('acct-brand').style.display = 'inline-block';
  document.getElementById('acct-brand').style.right = '90px';
  document.getElementById('profile').style.marginLeft = '45px';
  document.getElementById('icon-top-bar').style.left = '0';
};

const mobileCloseSideNav = () => {
  document.getElementById('icon-nav').style.marginLeft = '-45px';
  document.getElementById('profile-side-nav').style.display = 'none';
  document.getElementById('profile').style.marginLeft = '0';
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
