const api = (token) => {
  const baseUrl = "http://localhost:8000";

  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = "Bearer " + token;
  }

  const get = (url) => fetch(baseUrl + url, { method: "GET", headers });

  const post = (url, body) =>
    fetch(baseUrl + url, {
      method: "POST",
      body: JSON.stringify(body),
      headers,
    });

  const put = (url, body) =>
    fetch(baseUrl + url, {
      method: "PUT",
      body: JSON.stringify(body),
      headers,
    });

  const del = (url, body) =>
    fetch(baseUrl + url, {
      method: "DELETE",
      body: JSON.stringify(body),
      headers,
    });

  const postForm = (url, body) =>
    fetch(baseUrl + url, {
      method: "POST",
      body: new URLSearchParams(body),
      headers: {
        ...headers,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

  return { get, post, postForm, put, del };
};

export default api;
