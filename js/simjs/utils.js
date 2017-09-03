const onProgress = xhr => {
  if (xhr.lengthComputable) {
    const percentComplete = xhr.loaded / xhr.total * 100
    Void.log.debug(`${Math.round(percentComplete, 2)}% downloaded`)
  }
}

const onError = xhr => {}

const randomUniform = (min, max) => Math.random() * (max - min) + min


const getUrlParameter = (sParam) => {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
}


const guid = () => {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}


export {
  onProgress,
  onError,
  randomUniform,
  getUrlParameter,
  guid
}
