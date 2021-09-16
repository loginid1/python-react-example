import WebSDK from "@loginid/sdk";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { Wrapper, H2, Button, Input, Message } from "../styles/";
import { useCodeInterval } from "../../hooks/codes";
import { env } from "../../utils/env";
import {
  authorizeUser,
  createServiceToken,
  generatePermanentCode,
} from "../../services/api";

const { baseUrl, webClientId } = env;

const sdk = new WebSDK(baseUrl, webClientId);

const initalMessage = "";

const AddCredential = () => {
  const [username, setUsername] = useState("");
  const [setExpiresAt, setCode, message, code] = useCodeInterval(initalMessage);
  const history = useHistory();

  const handleUsernameInput = (event) => {
    setUsername(event.target.value);
  };

  const handleBack = () => {
    history.push("/");
  };

  const handleGenerateCode = async () => {
    try {
      const { code, expires_at: expiresAt } = await generatePermanentCode(
        username
      );
      setCode(code);
      setExpiresAt(expiresAt);
    } catch (e) {
      console.log(e);
      alert(e.message);
    }
  };

  const handleAddCredential = async () => {
    try {
      const { service_token: serviceToken } = await createServiceToken(
        "credentials.add",
        username
      );

      const { jwt } = await sdk.addFido2CredentialWithCode(
        username,
        code,
        serviceToken,
        { code_type: "short" }
      );

      await authorizeUser(jwt);

      history.push("/dashboard");
    } catch (e) {
      console.log(e);
      alert(e.message);
    }
  };

  return (
    <Wrapper>
      <H2>Add Credential</H2>
      {code && <Message noSpacing>Authorize this code: {code}</Message>}
      <Message>{message}</Message>
      <Input
        placeholder="Username"
        onChange={handleUsernameInput}
        value={username}
      />
      <Button onClick={handleGenerateCode}>Generate Code</Button>
      <Button onClick={handleAddCredential}>Add Credential</Button>
      <Button onClick={handleBack}>Go Back</Button>
    </Wrapper>
  );
};

export default AddCredential;
