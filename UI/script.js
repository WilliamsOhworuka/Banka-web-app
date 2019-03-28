//home page
let nav=document.getElementById('sidebar')
let pageContent=document.getElementById('page-content');

function openMenu(){
  nav.style.width='350px';
  pageContent.style.marginRight='350px';
  pageContent.style.marginLeft='-350px';
  pageContent.onfocus=closeMenu;
}

function closeMenu(){
  nav.style.width='0';
  pageContent.style.marginRight='0';
  pageContent.style.marginLeft='0';
}

function closeModal(){
  document.getElementById('confirmation-modal').style.display='none';
}

function openModal(){
  document.getElementById('confirmation-modal').style.display='block';
}

function openSideNav(){
  document.getElementById('icon-nav').style.marginLeft='-45px'
  document.getElementById('profile-side-nav').style.display='block';
  document.getElementById('acct-brand').style.display='none';
  document.getElementById('profile').style.marginLeft='241px'
}

function closeSideNav(){
  document.getElementById('icon-nav').style.marginLeft='0';
  document.getElementById('profile-side-nav').style.display='none';
  document.getElementById('acct-brand').style.display='inline-block';
  document.getElementById('acct-brand').style.right='90px';
  document.getElementById('profile').style.marginLeft='45px'
}
