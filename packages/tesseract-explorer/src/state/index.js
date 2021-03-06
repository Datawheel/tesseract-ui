import {hydratePermalink} from "../utils/permalink";
import {buildQuery} from "../utils/structs";
import {isValidQuery} from "../utils/validation";
import {loadingInitialState, loadingReducer} from "./loading/reducer";
import {queriesInitialState, queriesReducer} from "./queries/reducer";
import {serverInitialState, serverReducer} from "./server/reducer";

/** @type {TessExpl.State.ExplorerState} */
export const initialState = {
  explorerServer: serverInitialState,
  explorerLoading: loadingInitialState,
  explorerQueries: queriesInitialState
};

/** @returns {TessExpl.State.ExplorerState} */
export function explorerInitialState() {
  const explorerQueries = {...queriesInitialState};

  if (typeof window === "object") {
    const locationState =
      window.location.search && hydratePermalink(window.location.search);
    const historyState = window.history.state;
    console.debug({locationState, historyState});

    const defaultQuery = isValidQuery(locationState)
      ? buildQuery({params: locationState})
      : isValidQuery(historyState)
        ? buildQuery({params: historyState})
        : undefined;

    if (defaultQuery) {
      explorerQueries.current = defaultQuery.key;
      explorerQueries.itemMap = {[defaultQuery.key]: defaultQuery};
    }
  }

  return {
    ...initialState,
    explorerQueries
  };
}

/** @type {import("redux").Reducer<TessExpl.State.ExplorerState>} */
export function explorerReducer(state, action) {
  state = state || explorerInitialState();
  return {
    explorerServer: serverReducer(state.explorerServer, action),
    explorerLoading: loadingReducer(state.explorerLoading, action),
    explorerQueries: queriesReducer(state.explorerQueries, action)
  };
}
