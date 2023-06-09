const React = require('react');
const {Button, Modal} = require('bens_ui_components');
const {useEnhancedReducer} = require('bens_ui_components');
const {getThreads} = require('../hnAPI');
const {setQueryParam} = require('../url');
const {useState, useEffect} = React;

function Lobby(props) {
  const {dispatch} = props;
  const [threads, setThreads] = useState([]);
  useEffect(() => {
    getThreads().then(setThreads);
  }, []);
  console.log(threads);
  const displayThreads = [];

  for (let i = 0; i < 50 && i < threads.length; i++) {
    const thread = threads[i];
    displayThreads.push(
      <div
        key={"hn_thread_" + thread.id}
        style={{
          marginBottom: 8,
          paddingLeft: 8,
        }}
      >
        <div><a href={thread.url}>{thread.title}</a></div>
        <div
          style={{
            width: 'fit-content',
          }}
          className={"comments"}
          onClick={() => {
            history.pushState({}, '', '');
            window.scrollTo(0, 0);
            dispatch({type: 'SET', threadID: thread.id});
          }}
        >
          Comments: {thread.descendants}
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
      }}
    >
      {displayThreads}
    </div>
  );
}

module.exports = Lobby;
