const getPasswords = async (page = 1) => { // add page parameter with default
  try {
    const response = await api.get(`/passwords/?page=${page}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw new Error('Get Password List failed');
  }
};
