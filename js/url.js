function setQueryParam(key, value) {
  let url = new URL(window.location.href);
  let searchParams = url.searchParams;
  searchParams.set(key, value);
  url.search = searchParams.toString();
  window.history.pushState({path:url.toString()},'',url.toString());
}

function getQueryParam(key) {
  let url = new URL(window.location.href);
  let searchParams = url.searchParams;
  return searchParams.get(key);
}

function deleteQueryParam(key) {
  let url = new URL(window.location.href);
  let searchParams = url.searchParams;
  searchParams.delete(key);
  url.search = searchParams.toString();
  window.history.pushState({path:url.toString()},'',url.toString());
}

window.setQueryParam = setQueryParam;
window.getQueryParam = getQueryParam;
window.deleteQueryParam = deleteQueryParam;

module.exports = {
  setQueryParam,
  getQueryParam,
  deleteQueryParam,
}
