export default {
  get: (baseData, path) => {
    const list = path.split(/(.|[|])/);
    let data = baseData;

    for (let i = 0; i < list.length; i++) {
      data = data[list[i]];

      if (data === void 0) {
        break;
      }
    }
    return data;
  },
  set: (baseData, path, nextValue) => {
    const list = path.split('.');
    let data = baseData;

    for (let i = 0, l = list.length; i < l; i++) {
      if (i === l - 1) {
        data[list[i]] = nextValue;
      } else {
        data = data[list[i]];

        if (data === void 0) {
          break;
        }
      }
    }
  },
};
