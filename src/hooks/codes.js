import { useState, useEffect } from "react";

export const useCodeInterval = (initalMessage) => {
  const [code, setCode] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [message, setMessage] = useState(initalMessage);

  useEffect(() => {
    if (expiresAt) {
      const ID = setInterval(() => {
        const expires = new Date(expiresAt);
        const timeLeft = new Date(expires.getTime() - Date.now());

        if (timeLeft <= 0) {
          clearInterval(ID);
          setMessage(initalMessage);
          setCode("");
          setExpiresAt("");
        } else {
          const seconds =
            (timeLeft.getSeconds() < 10 ? "0" : "") + timeLeft.getSeconds();
          setMessage(`${timeLeft.getMinutes()}:${seconds}`);
        }
      }, 1000);

      return () => clearInterval(ID);
    }
  }, [expiresAt, initalMessage]);

  return [setExpiresAt, setCode, message, code];
};
