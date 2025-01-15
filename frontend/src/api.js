const api = (token) => {
  // const baseUrl = "http://localhost:8000";
  // const baseUrl = "https://zzsewbxcaahebc2xpdrp7r3xxy0gfrzr.lambda-url.us-east-2.on.aws";
  const baseUrl = process.env.REACT_APP_API_BASE_URL;

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
