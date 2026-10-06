const header=document.getElementById("header");
const menuToggle=document.getElementById("menuToggle");
const navMenu=document.getElementById("navMenu");
const themeToggle=document.getElementById("themeToggle");
const themeIcon=document.getElementById("themeIcon");
const currentYear=document.getElementById("currentYear");
const contactForm=document.getElementById("contactForm");
const formStatus=document.getElementById("formStatus");

if(currentYear) currentYear.textContent=new Date().getFullYear();

function handleHeader(){
  if(!header)return;
  header.classList.toggle("scrolled",window.scrollY>30);
}
window.addEventListener("scroll",handleHeader);
handleHeader();

if(menuToggle&&navMenu){
  menuToggle.addEventListener("click",()=>{
    menuToggle.classList.toggle("active");
    navMenu.classList.toggle("open");
    document.body.classList.toggle("no-scroll");
  });
  navMenu.querySelectorAll("a").forEach(link=>{
    link.addEventListener("click",()=>{
      menuToggle.classList.remove("active");
      navMenu.classList.remove("open");
      document.body.classList.remove("no-scroll");
    });
  });
}

function updateThemeIcon(){
  if(!themeIcon)return;
  themeIcon.textContent=document.body.classList.contains("light-mode")?"☀":"☾";
}
if(localStorage.getItem("portfolio-theme")==="light"){
  document.body.classList.add("light-mode");
}
updateThemeIcon();

if(themeToggle){
  themeToggle.addEventListener("click",()=>{
    document.body.classList.toggle("light-mode");
    const isLight=document.body.classList.contains("light-mode");
    localStorage.setItem("portfolio-theme",isLight?"light":"dark");
    updateThemeIcon();
  });
}

const revealElements=document.querySelectorAll(".reveal");
const revealObserver=new IntersectionObserver((entries,observer)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
},{threshold:.12});
revealElements.forEach(el=>revealObserver.observe(el));

if(contactForm){
  contactForm.addEventListener("submit",event=>{
    event.preventDefault();
    const name=document.getElementById("name").value.trim();
    const email=document.getElementById("email").value.trim();
    const subject=document.getElementById("subject").value.trim();
    const message=document.getElementById("message").value.trim();

    if(!name||!email||!subject||!message){
      showFormStatus("Completa todos los campos.","error");
      return;
    }

    const emailRegex=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegex.test(email)){
      showFormStatus("Introduce un correo electrónico válido.","error");
      return;
    }

    const destination="TU_CORREO@EJEMPLO.COM";
    const mailSubject=encodeURIComponent(subject);
    const mailBody=encodeURIComponent(`Hola Guillermo,\n\nMi nombre es ${name}.\n\nMi correo es:\n${email}\n\nMensaje:\n\n${message}\n\nSaludos.`);
    showFormStatus("Abriendo tu aplicación de correo...","success");
    setTimeout(()=>{
      window.location.href=`mailto:${destination}?subject=${mailSubject}&body=${mailBody}`;
    },700);
  });
}

function showFormStatus(message,type){
  if(!formStatus)return;
  formStatus.textContent=message;
  formStatus.style.color=type==="success"?"#c8ff3d":"#ff6b6b";
}

document.querySelectorAll('a[href^="#"]').forEach(anchor=>{
  anchor.addEventListener("click",function(event){
    const targetId=this.getAttribute("href");
    if(targetId==="#"||targetId.length<=1)return;
    const target=document.querySelector(targetId);
    if(target){
      event.preventDefault();
      const headerHeight=header?header.offsetHeight:0;
      const targetPosition=target.getBoundingClientRect().top+window.scrollY-headerHeight-20;
      window.scrollTo({top:targetPosition,behavior:"smooth"});
    }
  });
});

document.addEventListener("keydown",event=>{
  if(event.key==="Escape"&&navMenu&&navMenu.classList.contains("open")){
    navMenu.classList.remove("open");
    menuToggle.classList.remove("active");
    document.body.classList.remove("no-scroll");
  }
});
