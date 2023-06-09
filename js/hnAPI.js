
const getThreads = () => {
  return new Promise((resolve, reject) => {
    // Fetch the data for the front page
    fetch("https://hacker-news.firebaseio.com/v0/topstories.json")
      .then(response => response.json())
      .then(threadIDs => {
        threadIDs = threadIDs.slice(0, 50);
        // Create an array of promises that will eventually resolve to the thread data
        const threadPromises = threadIDs.map(threadID =>
          fetch(`https://hacker-news.firebaseio.com/v0/item/${threadID}.json`).then(response => response.json())
        );

        // Use Promise.all to wait for all the promises to resolve
        Promise.all(threadPromises)
          .then(threads => {
            // Once all the threads have been fetched, resolve the Promise with the threads array
            resolve(threads);
          })
          .catch(error => reject(error));
      })
      .catch(error => reject(error));
  });
}

const getThread = (threadID) => {
  return fetch(`https://hacker-news.firebaseio.com/v0/item/${threadID}.json`)
    .then(response => response.json())
}

const getCommentTree = (commentID) => {
  return new Promise((resolve, reject) => {
    fetch(`https://hacker-news.firebaseio.com/v0/item/${commentID}.json`)
      .then(response => response.json())
      .then(comment => {
        if (comment == null) {
          resolve(null);
        }
        if (comment.kids) {
          const promiseTree = [];
          for (const childID of comment.kids) {
            promiseTree.push(getCommentTree(childID));
          }
          Promise.all(promiseTree)
            .then((commentTree) => {
              resolve({...comment, children: commentTree});
            })
        } else {
          resolve(comment);
        }
      });
  });
}

const getComments = (threadID) => {
  return new Promise((resolve, reject) => {
    // Fetch the data for the thread
    fetch(`https://hacker-news.firebaseio.com/v0/item/${threadID}.json`)
      .then(response => response.json())
      .then(threadData => {
        const commentIDs = threadData.kids; // Get an array of comment IDs for the thread
        const topLevelCommentPromises = [];
        for (const commentID of commentIDs) {
          topLevelCommentPromises.push(getCommentTree(commentID));
        }

        Promise.all(topLevelCommentPromises)
          .then(topLevelComments => {
            resolve(topLevelComments);
          });
      })
      .catch(error => reject(error));
  });
}

module.exports = {
  getThread,
  getCommentTree,
  getThreads,
  getComments,
}
