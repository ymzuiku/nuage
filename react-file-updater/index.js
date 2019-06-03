import React from 'react';

function getCanvasBase64(url, width, height) {
  return new Promise(res => {
    const img = new Image(width, height);

    img.src = url;
    img.onload = () => {
      // width、height调用时传入具体像素值，控制大小 ,不传则默认图像大小
      const canvas = document.createElement('canvas');

      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext('2d');

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const dataURL = canvas.toDataURL('image/png');

      res(dataURL);
    };
  });
}

export default function FileUpdater({ canvasWidth, canvasHeight, onChange, onClick, onTouchEnd, name, ...rest }) {
  const inputRef = React.useRef();

  const hanldeOnClick = React.useCallback(
    (...args) => {
      onClick && onClick(...args);
      inputRef.current && inputRef.current.click();
    },
    [inputRef],
  );

  const handleOnChange = React.useCallback(
    e => {
      if (e.target.files) {
        const v = e.target.files[0];
        const reader = new FileReader();

        reader.onloadend = file => {
          file.fileType = v.type;
          file.lastModified = v.lastModified;
          file.name = v.name;
          file.result = file.target.result;
          file.url = window.URL.createObjectURL(v);
          file.width = canvasWidth || 100;
          file.height = canvasHeight || 100;
          getCanvasBase64(file.url, canvasWidth || 100, canvasHeight || 100).then(base64 => {
            file.base64 = base64;
            onChange && onChange(file);
          });
        };
        // files可能为空数组
        if (v) {
          reader.readAsBinaryString(v);
        }
      }
    },
    [inputRef],
  );

  return React.useCallback(
    <>
      <input
        onChange={handleOnChange}
        ref={inputRef}
        type="file"
        name={name}
        id="actor"
        accept=".svg, .png, .jpg, .jpge"
        style={{ display: 'none' }}
      />
      <div onClick={hanldeOnClick} {...rest} />
    </>,
    [inputRef, rest],
  );
}
