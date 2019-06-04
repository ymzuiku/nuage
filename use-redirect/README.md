# useRedirect

一个代替 react-router.Redirect 的 hooks

```js
import React from 'react';
import { HashRouter as Router, Route } from 'react-router-dom';
import useRedirect from '@nuage/use-redirect';
import Readme from './Readme';
import Order from './Order';

export default () => {
  useRedirect('/readme/');

  return (
    <Router>
      <div>
        <Route exact path="/readme/" component={Readme} />
        <Route exact path="/order/" component={Order} />
      </div>
    </Router>
  );
};
```
