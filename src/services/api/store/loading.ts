import { createStore } from "@/utils";

type State = {
  counter: number;
};

type Action = {
  type: "increase" | "decrease";
};

const { dispatch, ...store } = createStore<State, Action>(reducer, {
  counter: 0,
});

export default {
  ...store,
  startLoading() {
    dispatch({ type: "increase" });
  },
  stopLoading(delay = 0) {
    setTimeout(() => dispatch({ type: "decrease" }), delay);
  },
  getSnapshot() {
    return store.getSnapshot()?.counter > 0;
  },
};

function reducer(action: Action, state: State): State {
  switch (action.type) {
    case "increase":
      return {
        counter: state.counter + 1,
      };
    case "decrease":
      return {
        counter: Math.max(state.counter - 1, 0),
      };
    default:
      return state;
  }
}