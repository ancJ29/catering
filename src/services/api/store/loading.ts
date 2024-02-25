import { createStore } from "@/utils";

type State = {
  counter: number;
};

type Action = {
  type: "INCREASE" | "DECREASE";
};

const { dispatch, ...store } = createStore<State, Action>(reducer, {
  counter: 0,
});

export default {
  ...store,
  startLoading() {
    dispatch({ type: "INCREASE" });
  },
  stopLoading(delay = 0) {
    setTimeout(() => dispatch({ type: "DECREASE" }), delay);
  },
  getSnapshot() {
    return store.getSnapshot()?.counter > 0;
  },
};

function reducer(action: Action, state: State): State {
  switch (action.type) {
    case "INCREASE":
      return {
        counter: state.counter + 1,
      };
    case "DECREASE":
      return {
        counter: Math.max(state.counter - 1, 0),
      };
    default:
      return state;
  }
}
