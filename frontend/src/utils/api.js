const api = (token) => {
  const baseUrl = "http://127.0.0.1:8000";

  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = "Bearer " + token;
  }

  // ------------------------------------- #
  //              CREATE                   #
  // ------------------------------------- #

  const post = (url, body) =>
    fetch(baseUrl + url, {
      method: "POST",
      body: JSON.stringify(body),
      headers,
    });

  // ------------------------------------- #
  //              READ                     #
  // ------------------------------------- #

  // ------------------------------------- #
  //              UPDATE                   #
  // ------------------------------------- #
  // ------------------------------------- #
  //              DELTE                    #
  // ------------------------------------- #
  return { post };
};

export default api;
