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
  document.getElementById('profile').style.marginLeft='245px';
  document.getElementById('icon-top-bar').style.left='251px';
}

function mobileOpenSideNav(){
  document.getElementById('profile-side-nav').style.display='block';
  document.getElementById('profile').style.marginLeft='245px';
  document.getElementById('icon-top-bar').style.left='251px';
}

function closeSideNav(){
  document.getElementById('icon-nav').style.marginLeft='0';
  document.getElementById('profile-side-nav').style.display='none';
  document.getElementById('acct-brand').style.display='inline-block';
  document.getElementById('acct-brand').style.right='90px';
  document.getElementById('profile').style.marginLeft='45px';
  document.getElementById('icon-top-bar').style.left='0';
}

function mobileCloseSideNav(){
  document.getElementById('icon-nav').style.marginLeft='-45px';
  document.getElementById('profile-side-nav').style.display='none';
  document.getElementById('profile').style.marginLeft='0';
  document.getElementById('icon-top-bar').style.left='0';
}

function menu(){
  let ul=document.getElementById('drop-down-menu');
  if (ul.style.display === "block") {
    ul.style.display = "none";
  } else {
    ul.style.display = "block";
  }
}

function resetPassword(obj){
  let selectedValue = obj.options[obj.selectedIndex].value;
  if(selectedValue==='Yes'){
    document.getElementById('old-pswd').style.display='block';
    document.getElementById('new-pswd').style.display='block';
  }else{
    document.getElementById('old-pswd').style.display='none';
    document.getElementById('new-pswd').style.display='none';
  }
}
