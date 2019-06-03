import React, { createContext, useMemo } from 'react';
import immer from 'immer';

export default function createContextRedux() {
  // 创建一个  context, 用于后续配合 useContext 进行更新组件
  const store = createContext();

  // 创建一个提供者组件
  const Provider = ({ defaultState = {}, ...rest }) => {
    const [state, setState] = React.useState(defaultState);

    // 仅有 state 变更了, 才会重新更新 context 和 store
    return useMemo(() => {
      // 使用 immer 进行更新状态, 确保未更新的对象还是旧的引用
      const dispatch = fn => setState(immer(state, v => fn(v)));

      store.state = state;
      store.dispatch = dispatch;

      return <store.Provider value={state} {...rest} />;
    }, [state]);
  };

  return { Provider, store };
}
