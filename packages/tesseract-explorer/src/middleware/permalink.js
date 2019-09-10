import {AGGREGATION_UPDATE} from "../actions/aggregation";
import {queryInyect} from "../actions/query";
import {serializePermalink} from "../utils/permalink";

/** @type {import("redux").Middleware<{}, import("../reducers").ExplorerState>} */
function permalinkMiddleware({dispatch, getState}) {
  if (typeof window === "object") {
    window.addEventListener("popstate", function historyIntercepter(evt) {
      dispatch(queryInyect(evt.state));
    });
  }

  return next => {
    return action => {
      if (action.type === AGGREGATION_UPDATE) {
        const {explorerCubes: nextCubes, explorerQuery: nextQuery} = getState();

        if (nextCubes[nextQuery.cube] != null) {
          const nextPermalink = serializePermalink(nextQuery);

          console.groupCollapsed("Permalink changed");
          console.log(nextQuery);
          console.groupEnd();

          if (typeof window === "object") {
            const nextLocation = `${window.location.pathname}?${nextPermalink}`;
            window.history.pushState(nextQuery, "", nextLocation);
          }
        }
      }

      return next(action);
    };
  };
}

export default permalinkMiddleware;
