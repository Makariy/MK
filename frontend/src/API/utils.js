import RequestError from './exceptions.js';
import Pica from 'pica';



export const checkResponseError = (response) => {
    if (response.status != 'success') {
        throw new RequestError(response);
    }
    return response;
}


let pica = new Pica();

function _resizeImage(file, dimensionsFn) {
    return new Promise((resolve, reject) => {
      const img = new Image();
  
      img.onload = () => {
        const offscreenCanvas = document.createElement("canvas");
        const { width, height } = dimensionsFn(img);
        offscreenCanvas.width = width;
        offscreenCanvas.height = height;
        pica.resize(img, offscreenCanvas)
          .then(() => {
            return pica.toBlob(offscreenCanvas, "image/png");
          })
          .then(resolve, reject);
      };
      img.src = file;
    });
  }

export const resizeImage = (file, target) => {
    return _resizeImage(file, img => {
        const landscape = img.width > img.height;
        let width, height;
        if (landscape) {
          width = target;
          height = Math.round((target * img.height) / img.width);
        } else {
          width = Math.round((target * img.width) / img.height);
          height = target;
        }
        return { width, height };
      });
}
