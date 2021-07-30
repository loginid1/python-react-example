const request = async (url, options) => {
  const { method = "POST", headers = {}, body = {} } = options;
  try {
    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) throw res;

    return await res.json();
  } catch (e) {
    throw e;
  }
};

export const authorizeUser = async (jwt) => {
  return await request("/api/users", { body: { jwt } });
};
