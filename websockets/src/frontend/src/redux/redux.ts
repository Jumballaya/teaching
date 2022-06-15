
export type ReduxDispatch = (action: ReduxAction) => void;
export type ReduxReducer<T> = (state: T, action: ReduxAction) => T;
export type ReduxListener = () => void;
export type UnsubFunction = () => void;
export type MiddlewareFactory = <T>(s: ReduxStore<T>) => (d: ReduxDispatch) => ReduxDispatch;

export interface ReduxAction<T = any> {
  type: string
  payload: T;
}

export interface ReduxStore<T> {
  getState: () => T;
  dispatch: ReduxDispatch;
  subscribe: (l: ReduxListener) => UnsubFunction;
}

function decorateDispatch<T>(store: ReduxStore<T>, middlewareFactories: MiddlewareFactory[]) {
  let { dispatch } = store;
  middlewareFactories.forEach(f => {
    dispatch = f(store)(dispatch);
  });
  return dispatch;
}

export function createStore<T>(reducer: ReduxReducer<T>, initialState: T, middlewareFactories = []): ReduxStore<T> {
  // Create State
  let state = initialState;

  // Create Listeners
  const listeners: ReduxListener[] = [];

  // Get State
  const getState = () => state;

  // Dispatch action
  const dispatch = (action: ReduxAction) => {
    state = reducer(state, action);
    listeners.forEach(l => l());
  };

  // Subscribe
  const subscribe = (listener: ReduxListener) => {
    listeners.push(listener);
    return () => {
      const index = listeners.indexOf(listener);
      if (index >= 0) {
        listeners.splice(index, 1);
      }
    };
  };

  // Create Store and setup dispatch
  const store: ReduxStore<T> = { getState, dispatch, subscribe };
  store.dispatch = decorateDispatch(store, middlewareFactories);
  return store;
}

export function combineReducers<T>(obj: Record<string, ReduxReducer<any>>) {
  return (state: T, action: ReduxAction) => {
    const newState = {} as T;
    for (const key in obj) {
      const reducer: ReduxReducer<any> = obj[key];
      const _state: any = (state as any)[key];
      (newState as any)[key] = reducer(_state, action);
    }
    return newState;
  };
}
