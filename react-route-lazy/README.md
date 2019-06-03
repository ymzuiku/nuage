# 方便的使用懒加载

同步加载

```js
import React from 'react';
import LazyRoute from '@nuage/react-lazy-route';
import Home from './Home';

<Router>
  <LazyRoute exact path="/home/*" component={Home} />
</Router>;
```

异步加载

```js
import React, { lazy } from 'react';
import LazyRoute from '@nuage/react-lazy-route';

const Home = lazy(() => import('./Home'));

<Router>
  <LazyRoute exact path="/home/*" component={Home} />
</Router>;
```
