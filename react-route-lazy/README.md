# 方便的使用懒加载

```js
import LazyRoute from '@nuage/react-lazy-route';
import Home from './Home';

<Router>
  <LazyRoute exact path="/home/*" component={Home} />
</Router>;
```
