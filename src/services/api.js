import { codeTypes } from "../data/codesTypes";

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

export const createServiceToken = async (type, username, txPayload) => {
  return await request("/api/token", {
    body: { type, username, tx_payload: txPayload },
  });
};

export const createTxServiceToken = async (txPayload, username) => {
  return await request("/api/token", {
    body: { username, tx_payload: txPayload },
  });
};

export const createTx = async (txPayload, username) => {
  return await request("/api/tx", {
    body: { tx_payload: txPayload, username },
  });
};

export const verifyTx = async (jwt, txPayload) => {
  return await request("/api/tx/verify", {
    body: { jwt, tx_payload: txPayload },
  });
};

export const generateTemporaryCode = async (username) => {
  return await request("/api/codes/generate", {
    body: { purpose: codeTypes.TEMPORARY_AUTHENTICATION, username },
  });
};

export const waitForAuthorizeCode = async (username, code) => {
  return await request("/api/users/temporary", {
    body: { username, code },
  });
};

export const authorizeCode = async (username, code) => {
  return await request("/api/codes/authorize", {
    body: { username, code },
  });
};
