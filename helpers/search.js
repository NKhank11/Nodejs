module.exports = (query) => {
  let objectSearch = {
    keyword: "",
  }

  if(query.keyword) {
    objectSearch.keyword = query.keyword;
    const regex = new RegExp(objectSearch.keyword, "i");   // i: khong phan biet hoa thuong
    objectSearch.regex = regex;
  }
  return objectSearch;
}