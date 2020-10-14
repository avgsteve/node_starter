import '@babel/polyfill';



// === GLOBAL CODE FOR FUNCTIONS ACROSS SITE ===

const currentURLPath = window.location.pathname;
console.log(`Current website path: `, currentURLPath);

// Intialize Materialize Components
window.addEventListener('load', (event) => {

});


// All the startup functions/applications to be loaded after browser finishes loading
document.addEventListener('DOMContentLoaded', function () {

  console.log('document is loaded');

});




let alertMessage = $('.alert__test');

$('.show_alert').on('click', function () {
  alertMessage.fadeIn();
  closeSnoAlertBox(alertMessage);
});


let alertMessag2 = $('.alert__test2');

$('.show_alert2').on('click', function () {
  alertMessag2.fadeIn();
  closeSnoAlertBox(alertMessag2);
});


function closeSnoAlertBox(element) {
  window.setTimeout(function () {
    element.fadeOut(300);
  }, 3000);
}


