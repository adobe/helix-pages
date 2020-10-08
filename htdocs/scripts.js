/**
 * Creates a tag with the given name and attributes.
 * @param {string} name The tag name
 * @param {object} attrs An object containing the attributes
 * @returns The new tag
 */
function createTag(name, attrs) {
    const el = document.createElement(name);
    if (typeof attrs === 'object') {
      for (let [key, value] of Object.entries(attrs)) {
        el.setAttribute(key, value);
      }
    }
    return el;
  }

/**
 * Wraps all the elements identified by the selector with a div.section-wrapper.
 * @param {string} selector selector
 */

function wrap(selector, className) {
    document.querySelectorAll(selector).forEach(($e) => {
        const $wrapper=createTag('div', { class: className});
        $e.parentNode.replaceChild($wrapper, $e);
        $wrapper.appendChild($e);
    });
}

/**
 * Turn leading image into a title section.
 */

function createHeroSection() {
  const $headerImg=document.querySelector('main>div:first-of-type>div>:first-child>img');
  if ($headerImg) {
    const src=$headerImg.getAttribute('src');
    $wrapper=$headerImg.closest('.section-wrapper');
    $wrapper.style.backgroundImage=`url(${src})`;
    $wrapper.classList.add('hero');
    $headerImg.parentNode.remove();
  }
}

function decoratePage() {
    wrap('main table', 'table-wrapper')
    wrap('main>div', 'section-wrapper');
    createHeroSection();
}

window.addEventListener('DOMContentLoaded', (event) => {
    decoratePage();
});