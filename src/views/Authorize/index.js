import { useState } from "react";
import WebSDK from "@loginid/sdk";
import { useHistory } from "react-router-dom";
import { Wrapper, H2, Button, Input, Message } from "../styles/";
import { env } from "../../utils/env";
import { authorizeCode, createServiceToken } from "../../services/api";

const { baseUrl, webClientId } = env;

const sdk = new WebSDK(baseUrl, webClientId);

const Authorize = () => {
  const [username, setUsername] = useState("");
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const history = useHistory();

  const handleUsername = (event) => {
    setUsername(event.target.value);
  };

  const handleCode = (event) => {
    setCode(event.target.value);
  };

  const handleBack = () => {
    history.push("/");
  };

  const handleAuthorizeCode = async () => {
    try {
      const { service_token: serviceToken } = await createServiceToken(
        "auth.login",
        username
      );

      await sdk.authenticateWithFido2(username, {
        authorization_token: serviceToken,
      });

      await authorizeCode(username, code);

      setMessage(`Code Authorized: ${code}`);
      setUsername("");
      setCode("");
    } catch (e) {
      console.log(e);
      alert(e.message);
    }
  };

  return (
    <Wrapper>
      <H2>Authorize Code</H2>
      {message && <Message>{message}</Message>}
      <Input
        placeholder="Username"
        onChange={handleUsername}
        value={username}
      />
      <Input placeholder="Code" onChange={handleCode} value={code} />
      <Button onClick={handleAuthorizeCode}>Authorize Code</Button>
      <Button onClick={handleBack}>Go Back</Button>
    </Wrapper>
  );
};

export default Authorize;
