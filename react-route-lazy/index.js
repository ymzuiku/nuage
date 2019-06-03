import React, { Suspense, useCallback } from 'react';
import { Route } from 'react-router-dom';

function LazyRoute({ exact, path, component, fallback = null, ...rest }) {
  const Comp = component;

  return useCallback(
    <Route
      exact={exact}
      path={path}
      render={props => {
        return (
          <Suspense fallback={fallback}>
            <Comp {...props} />
          </Suspense>
        );
      }}
      {...rest}
    />,
    [exact, path],
  );
}

export default LazyRoute;
