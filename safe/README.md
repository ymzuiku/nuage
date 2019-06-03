# Safe get and set object

```js
import safe from '@nuage/safe';

const test = {
  name: 'dog',
  age: 10,
};

safe.get(test, 'name'); // dog
safe.get(test, 'name.xx[20].50'); // void 0
safe.set(test, 'name', 100); // test.name = 100
safe.set(test, 'name.bb', 100); // test.name = 100
```
