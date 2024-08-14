module.exports = (objectPagination, query, countProducts) => {
  if(query.page) {
    objectPagination.currentPage = parseInt(query.page);  // Chuyen String sang Number
  }

  objectPagination.skip = (objectPagination.currentPage - 1) * objectPagination.limitItems;

  const totalPages = Math.ceil(countProducts / objectPagination.limitItems);
  objectPagination.totalPages = totalPages;
  return objectPagination;
}