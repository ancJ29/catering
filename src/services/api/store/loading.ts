import { createStore } from "@/utils";

type State = {
  counter: number;
};

enum ActionType {
  INCREASE = "INCREASE",
  DECREASE = "DECREASE",
}

type Action = { type: ActionType };

const { dispatch, ...store } = createStore<State, Action>(reducer, {
  counter: 0,
});

export default {
  ...store,
  startLoading() {
    dispatch({ type: ActionType.INCREASE });
  },
  stopLoading(delay = 0) {
    setTimeout(() => dispatch({ type: ActionType.DECREASE }), delay);
  },
  toggleLoading(delay = 500) {
    dispatch({ type: ActionType.INCREASE });
    setTimeout(() => dispatch({ type: ActionType.DECREASE }), delay);
  },
  getSnapshot() {
    return store.getSnapshot()?.counter > 0;
  },
};

function reducer(action: Action, state: State): State {
  switch (action.type) {
    case ActionType.INCREASE:
      return {
        counter: state.counter + 1,
      };
    case ActionType.DECREASE:
      return {
        counter: Math.max(state.counter - 1, 0),
      };
    default:
      return state;
  }
}
