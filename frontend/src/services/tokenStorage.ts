const setToken = (token: string) => {
  localStorage.setItem("token", token);
};

const getToken = (): string | null => {
  return localStorage.getItem("token");
};

export { setToken, getToken };
