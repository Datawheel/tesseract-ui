import {Classes} from "@blueprintjs/core";
import classNames from "classnames";
import React, {useEffect, useState} from "react";
import {connect} from "react-redux";
import LoadingScreen from "../components/LoadingScreen";
import ResultPivot from "../components/ResultPivot";
import ResultRaw from "../components/ResultRaw";
import ResultTable from "../components/ResultTable";
import {doClientSetup} from "../middleware/actions";
import {updateLocaleList} from "../state/server/actions";
import {selectServerState} from "../state/server/selectors";
import {selectIsDarkTheme} from "../state/ui/selectors";
import {ExplorerParams} from "./ExplorerParams";
import ExplorerQueries from "./ExplorerQueries";
import ExplorerResults from "./ExplorerResults";

/**
 * @typedef OwnProps
 * @property {string | import("axios").AxiosRequestConfig} src The URL for the data server.
 * @property {string[]} locale A list of the available locale options
 * @property {Record<string, React.FunctionComponent | React.ComponentClass>} panels
 */

/**
 * @typedef StateProps
 * @property {boolean} darkTheme
 * @property {boolean} isLoaded
 */

/**
 * @typedef DispatchProps
 * @property {(src: string | import("axios").AxiosRequestConfig) => any} setupClient
 * @property {(locale: string[]) => any} updateLocaleList
 */

/** @type {React.FC<OwnProps & StateProps & DispatchProps>} */
const ExplorerComponent = ({locale, src, darkTheme, isLoaded, updateLocaleList, setupClient, panels}) => {
  const [availableLocale] = useState(locale);

  useEffect(() => {
    updateLocaleList(locale);
    setupClient(src);
  }, [availableLocale, src]);

  return (
    <div className={classNames("explorer-wrapper", {[Classes.DARK]: darkTheme})}>
      <LoadingScreen className="explorer-loading" />
      <ExplorerQueries className="explorer-queries" />
      {isLoaded ? <ExplorerParams className="explorer-params" /> : <div/>}
      <ExplorerResults className="explorer-results" panels={panels} />
    </div>
  );
};

ExplorerComponent.defaultProps = {
  locale: ["en"],
  panels: {
    "Data table": ResultTable,
    "Pivot table": ResultPivot,
    "Raw response": ResultRaw
  }
};

/** @type {TessExpl.State.MapStateFn<StateProps, OwnProps>} */
const mapState = state => ({
  darkTheme: selectIsDarkTheme(state),
  isLoaded: Boolean(selectServerState(state).online)
});

/** @type {TessExpl.State.MapDispatchFn<DispatchProps, OwnProps>} */
const mapDispatch = dispatch => ({
  setupClient(src) {
    dispatch(doClientSetup(src));
  },
  updateLocaleList(locale) {
    dispatch(updateLocaleList(locale));
  }
});

/** @type {import("react-redux").MergeProps<StateProps, DispatchProps, OwnProps, OwnProps & StateProps & DispatchProps>} */
const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps
});

export default connect(mapState, mapDispatch, mergeProps)(ExplorerComponent);
