const request = async (url, options = {}) => {
  const { method = "POST", headers = {}, body = {} } = options;
  try {
    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      ...(method !== "GET" && { body: JSON.stringify(body) }),
    });

    if (res.status === 204) return;

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message);
    }

    return await data;
  } catch (e) {
    throw e;
  }
};

export const authorizeUser = async (jwt) => {
  return await request("/api/users", { body: { jwt } });
};

export const getUser = async () => {
  return await request("/api/users", { method: "GET" });
};

export const logoutUser = async () => {
  return await request("/api/logout");
};

export const createServiceToken = async (type, username) => {
  return await request("/api/tokens/create", { body: { type, username } });
};
