import { combineReducers, createStore, ReduxAction, ReduxReducer } from './redux';

interface MState {
  x: number;
  y: number;
  type: string;
}

const initMouse: MState = { x: 0, y: 0, type: 'mouse' };
const mouse: ReduxReducer<MState> = (state: MState, action: ReduxAction<number>) => {
  const type: string = action.type;
  switch (type) {
    case 'update-x': {
      return { ...state, x: state.x + action.payload };
    }
    case 'update-y': {
      return { ...state, y: state.y + action.payload };
    }
    default: {
      return state;
    }
  }
}


interface User {
  name: string;
  updated: Date;
}

interface UState {
  users: User[]
}

const initUstate = { users: [] };
const user: ReduxReducer<UState> = (state: UState, action: ReduxAction<User | string>) => {
  const type: string = action.type;
  const payload = action.payload;
  switch (type) {
    case 'add-user': {
      if (typeof payload !== 'string') {
        return { ...state, users: state.users.concat(payload) };
      }
    }
    case 'remove-user': {
      return { ...state, users: state.users.filter(u => u.name !== payload) };
    }
    default: {
      return state;
    }
  }
}


interface State {
  user: UState;
  mouse: MState;
}

const reducer = combineReducers<State>({ user, mouse })
const store = createStore(reducer, { user: initUstate, mouse: initMouse });


console.log(store.getState());
store.dispatch({ type: 'update-x', payload: 7 });
console.log(store.getState());
store.dispatch({ type: 'add-user', payload: { name: 'patrick', date: new Date() } });
console.log(store.getState());