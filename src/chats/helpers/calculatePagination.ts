export const calculatePagination = (page: string, limit: string) => {
  const parsedPage = parseInt(page) || 1;
  const parsedLimit = parseInt(limit) || 20;

  return {
    startIndex: (parsedPage - 1) * parsedLimit,
    parsedLimit,
  };
};
