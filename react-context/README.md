# 基于 hooks, context, immer 的 Redux 实现

## Feature

- 简易: 简化了 redux 的使用方式, 仅有 action 及 state 的概念, 且遵循 redux 单向数据流, 数据驱动页面的设计思维;
- 轻量: 仅用 react 自带的 hook 及 context 实现, 源码加注释仅有 40 行, 数据变更使用 immer 库;
- 高性能: 为了更颗粒的控制组件更新, 使用 immer 进行数据的设定, 虽然是不可变数据, 但是使用过程中是无感知的;
- 局部更新: 引入一个局部更新和局部更新拦截的思路，让状态管理的控制更细微

## 安装

```sh
$ yarn add @nuage/react-context
```

## 编译

> @nuage/\* 系列的库都都不会进行编译发布: 为了在不使用 Typescript 的前提下更好地利用 Javascript 的提示

此库未编译, 也不愿意编译后发布, 使用请配置 webpack 的 babel:

```js
// Process application JS with Babel.
// The preset includes JSX, Flow, TypeScript, and some ESnext features.
{
  test: /\.(js|mjs|jsx|ts|tsx)$/,
  // 此处添加 @nuage 的正则, 使得 @nuage/* 的库会被 babel 编译
  include: [/@nuage/, paths.appSrc],
  loader: require.resolve('babel-loader'),
  ...
}
```

## 基础使用

```js
import React from 'react';
import { render } from 'react-dom';
import createReactContext from '@nuage/react-context';

const { Provider, store } = createReactContext();

// 模拟一个异步
function fetchData() {
  return new Promise(res => {
    setTimeout(() => {
      res();
    }, 500);
  });
}

// 一个基础的 action, 用来修改状态
// 在实际项目中, action 应该统一放置一处, 不应该分散在各组件中
async function actionOfAddNum() {
  await fetchData();

  store.dispatch(state => {
    state.age += 1;
  });
}

// 点击之后, 利用 action 修改全局状态
function Changer() {
  return (
    <button type="button" onClick={actionOfAddNum}>
      add
    </button>
  );
}

// 利用 useContext 监听全局状态, 并随时进行更新
function Shower() {
  const { age } = React.useContext(store);

  return <div>age: {age}</div>;
}

function App() {
  return (
    <Provider defaultState={{ age: 0 }}>
      <Shower />
      <Changer />
    </Provider>
  );
}

render(<App />, document.getElementById('root'));
```

## 局部更新

Flutter 问世之后，有许多状态管理方案，其中就包含 Redux 风格的方案。Flutter 的 Provider 及 flutter_redux 两个状态管理库中，都使用了一个局部更新的方式来控制重绘区域，此库根据其思路也实现了一个局部的 Consumer 组件供君使用。

Consumer 和 context.Consumer 作用相同，唯一的区别仅仅是 Consumer 可以配合 useMemo 进行更新拦截

```js
import React from 'react';
import { render } from 'react-dom';
import createReactContext from './react-context';

const { Provider, Consumer, store } = createReactContext({ num: 0 });

function App() {
  console.log('整个组件只会渲染一次');

  return (
    <div>
      <header>
        <p>
          Only change <code>Consumer Component</code>:
        </p>
        <Consumer>
          {({ num }) => {
            console.log('此组件会被重复渲染');
            return <p>{num}</p>;
          }}
        </Consumer>

        <button
          onClick={() => {
            store.dispatch(state => {
              state.num += 1;
            });
          }}
        >
          addNumber
        </button>
      </header>
    </div>
  );
}
render(
  <Provider>
    <App />
  </Provider>,
  document.getElementById('root'),
);
```

### 局部更新的拦截

如果传递了 memo 函数, 则子组件会被 useMemo 包裹，memo 的返回值是 useMemo 的第二个参数， useMemo 的用法可阅读 [React.hooks.useMemo](https://reactjs.org/docs/hooks-reference.html#usememo)

下面的例子，子组件只有当 state.num 改变了才会重绘，其他属性的修改会被拦截

```js
<Consumer memo={state => [state.num]}>
  {({ num }) => {
    return <p>{num}</p>;
  }}
</Consumer>
```

## 异步更新

异步更新不需要引入任何新 API\中间键, 只需要在 action 中执行任何异步行为, 在异步结束之后进行更新

```js
// action.js
import { store } from './createContext.js';

async function actionOfFetchUser() {
  const info = await fetch(...);

  // 在请求之后更新数据
  store.dispatch(state => {
      state.age += 1;
  });
}
```

## 工程化

我们需要将 action 分离到公共区域, 组件只需要发起 action, 获得新的数据即可

### 1. 创建 store 及 Provider

```js
// createContext.js
import createContextRedux from '@nuage/react-context';

const { store, Provider } = createContextRedux();

export { store, Provide };
```

### 2. 在项目顶部声明 Provide

```js
// App.js
import { Provide } from './createContext.js';
import Changer from './Changer';
import Shower from './Shower';

function App() {
  return (
    <Provider defaultState={{ name: 'dog' }}>
      <Changer />
      <Shower />
    </Provider>
  );
}
```

### 3. 声明修改 state 的 action

```js
// action.js
import { store } from './createContext.js';

export function actionOfChangeAge() {
  store.dispatch(state => {
    state.age = 500;
  });
}
```

### 4. 实现两个组件, 跨组件更新

```js
// Changer.js
import { actionOfChangeAge } from './action.js';

function Changer() {
  return <button onClick={actionOfChangeAge}>click this change age</button>;
}
```

```js
// Shower.js
import { store } from './createContext.js';

function Shower() {
  // 注册 store
  const { age } = React.useContext(store);

  // 使用 userCallback 管理控制, 只有 age 修改时, 才会进行重绘
  return React.useCallback(<div>age: {age}</div>, [age]);
}
```

### 感谢阅读
