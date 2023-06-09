const React = require('react');
const {Button} = require('bens_ui_components');
const {useEnhancedReducer} = require('bens_ui_components');
const {getThreads} = require('../hnAPI');
const {setQueryParam, getQueryParam, deleteQueryParam} = require('../url');
const Lobby = require('./Lobby.react');
const Thread = require('./Thread.react');
const {useState, useEffect} = React;

const urlReducer = (state, action) => {
  switch (action.type) {
    case 'SET': {
      for (const prop in action) {
        if (prop == 'type') continue;
        state[prop] = action[prop];
        if (action[prop] != null) {
          setQueryParam(prop, action[prop]);
        } else {
          deleteQueryParam(prop);
        }
      }
    }
  }
  return {...state};
}

function Main(props) {
  const [state, dispatch, getState] = useEnhancedReducer(
    urlReducer, {}
  );
  window.getState = getState;
  window.dispatch = dispatch;

  // browser back button and localStorage
  useEffect(() => {
    if (!localStorage.getItem("blockList")) {
      localStorage.setItem("blockList", JSON.stringify([]));
    }

    window.addEventListener('popstate', function(ev) {
      dispatch({type: 'SET', threadID: null});
      // window.location.href = '/';
      ev.preventDefault();
    });
  }, []);

  // listen for URL changes
  useEffect(() => {
    const threadID = getQueryParam('threadID');
    if (threadID != state.threadID) {
      window.scrollTo(0, 0);
      console.log("push history state");
      history.pushState({}, '', '');
      dispatch({type: 'SET', threadID});
    }
  }, [state.threadID]);

  let content = null;
  if (state.threadID) {
    content = <Thread threadID={state.threadID} />
  } else {
    content = <Lobby dispatch={dispatch} />
  }

  return (
    <React.Fragment>
      <h3
        style={{
          cursor: 'pointer',
        }}
        onClick={() => {
          history.pushState({}, '', '');
          window.scrollTo(0, 0);
          dispatch({type: 'SET', threadID: null});
        }}
      >
        Ben's Better Hacker News Reader
      </h3>
      {content}
      {state.modal}
    </React.Fragment>
  )
}


module.exports = Main;
