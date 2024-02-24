import { GenericObject } from "@/types";

type Listener = () => void;

export function createStore<
  State extends GenericObject,
  Action extends GenericObject,
>(
  reducer: (action: Action, state: State) => State,
  initialState: State,
) {
  let listeners: Listener[] = [];

  let snapshot: State = initialState;

  const store = {
    dispatch(action: Action) {
      snapshot = reducer(action, snapshot);
      emit();
    },
    subscribe(listener: Listener) {
      listeners = [...listeners, listener];
      return () => {
        listeners = listeners.filter((l) => l !== listener);
      };
    },
    getSnapshot() {
      return snapshot;
    },
  };

  function emit() {
    for (const listener of listeners) {
      listener();
    }
  }

  return {
    subscribe: store.subscribe,
    getSnapshot: store.getSnapshot,
    dispatch: store.dispatch,
  };
}
