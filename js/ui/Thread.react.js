const React = require('react');
const {Button, Divider} = require('bens_ui_components');
const {getComments, getThread} = require('../hnAPI');
const parse = require('html-react-parser');
const {useState, useEffect} = React;

function Thread(props) {
  const {threadID} = props;
  const blockList = JSON.parse(localStorage.getItem("blockList"));

  const [thread, setThread] = useState({title: '', url: ''});
  const [comments, setComments] = useState([]);
  useEffect(() => {
    getComments(threadID).then(setComments);
    getThread(threadID).then(setThread);
  }, [threadID]);
  console.log(comments);

  const displayComments = [];
  for (const c of comments) {
    if (!c.text || c.deleted) continue;
    if (blockList.includes(c.by)) {
      displayComments.push(<Divider key={"comment_" + c.id}
        style={{border: '1px solid #b1a485', margin: '6 50', width: 'auto'}}
      />);
      continue;
    }
    displayComments.push(<Comment comment={c} key={"comment_" + c.id} />);
  }

  return (
    <div
      style={{
      }}
    >
      <a
        style={{
          paddingLeft: 25,
          marginBottom: 10,
          marginTop: 10,
          fontWeight: 'bold',
        }}
        href={thread.url}
      >
        {thread.title}
      </a>
      {displayComments}
    </div>
  );
}

const Comment = (props) => {
  const {comment} = props;
  const blockList = JSON.parse(localStorage.getItem("blockList"));

  const children = [];
  if (comment.children) {
    for (const c of comment.children) {
      if (!c.text || c.deleted) continue;
      if (blockList.includes(c.by)) {
        children.push(<Divider key={"comment_" + c.id}
          style={{border: '1px solid #b1a485', margin: '6 50', width: 'auto'}}
        />);
        continue;
      }
      children.push(<Comment comment={c} key={"comment_" + c.id} />);
    }
  }

  return (
    <div
      className="comment"
      style={{
        marginTop: 6,
      }}
    >
      <div
        className={"parent"}
        style={{
          fontSize: 11,
          height: 15,
          color: '#828282',
        }}
      >
        <a
          href={"https://news.ycombinator.com/user?id=" + comment.by}
          style={{color: '#828282'}}
        >
          {comment.by}
        </a>
        <Button
          style={{
            float: 'right',
            fontSize: 11,
            color: '#828282',
            border: 'none',
          }}
          label={"block"}
          onClick={() => {
            localStorage.setItem("blockList", JSON.stringify([...blockList, comment.by]));
            dispatch({rerender: true});
          }}
        />
      </div>
      <div
        style={{
          fontSize: 12.5,
          fontWeight: 400,
        }}
      >{parse(comment.text)}</div>
      {children}
    </div>
  );
}

module.exports = Thread;
