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
