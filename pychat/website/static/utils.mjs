export function makeElement(html) {
    const template = document.createElement('template');
    template.innerHTML = html.trim();
    return template.content.firstChild;
}


export function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}


export function setCookie(name, value, options = {}) {
  options = {
    path: '/',
    ...options
  };

  if (options.expires) {
    options.expires = options.expires.toUTCString();
  }

  let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);

  for (let optionKey in options) {
    updatedCookie += "; " + optionKey;
    let optionValue = options[optionKey];
    if (optionValue !== true) {
      updatedCookie += "=" + optionValue;
    }
  }

  document.cookie = updatedCookie;
}


export function deleteCookie(name) {
  setCookie(name, "", {
    'max-age': -1
  })
}


export function getUserInfo() {
    const payload = atob(getCookie('auth').split('.')[1]);
    return JSON.parse(payload);
}