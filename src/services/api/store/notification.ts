import { createStore } from "@/utils/store";

export type State = {
  notifications: {
    id: string;
    color: string;
    message: string;
    translate?: boolean;
  }[];
};

export type Action = {
  type: "PUSH" | "REVOKE";
  payload?: {
    id: string;
    color: string;
    message: string;
    translate?: boolean;
  };
  id?: string;
};

export function reducer(action: Action, state: State): State {
  switch (action.type) {
    case "PUSH":
      if (action.payload) {
        return { notifications: [action.payload] };
      }
      return state;
    case "REVOKE":
      if (action.id) {
        const notifications = state.notifications.filter(
          (notification) => notification.id !== action.id,
        );
        return { notifications };
      }
      break;
    default:
      return state;
  }
  return state;
}

const { dispatch, ...store } = createStore<State, Action>(reducer, {
  notifications: [],
});

export default {
  ...store,
  push(payload: {
    color: string;
    message: string;
    translate?: boolean;
  }) {
    const type = "PUSH";
    const id = Math.random().toString(36).slice(2);
    dispatch({ type, payload: { ...payload, id } });
    setTimeout(() => {
      dispatch({ type: "REVOKE", id });
    }, 3000);
  },
  getSnapshot() {
    return store.getSnapshot()?.notifications;
  },
};
