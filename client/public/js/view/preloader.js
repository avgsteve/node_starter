export function showPreloader() {
  // console.log('showPreloader() is called');

  hidePreloader();
  const preloaderMarkup = `  
  <div class="fill-viewport-filter">
  <div class="progress">
  <div class="indeterminate"></div>
  </div>  
  </div>
  `;

  document.querySelector('body').insertAdjacentHTML('afterbegin', preloaderMarkup);

};




export function hidePreloader() {

  // console.log('hidePreloader() is called');

  const fullViewportPreloader = document.querySelector('.fill-viewport-filter');

  // console.log('fullViewportPreloader', fullViewportPreloader);

  if (fullViewportPreloader) {
    fullViewportPreloader.parentElement.removeChild(fullViewportPreloader);
  }
};