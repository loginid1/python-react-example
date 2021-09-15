import { useState } from "react";
import { useHistory } from "react-router-dom";
import { Wrapper, Button, Input, Message } from "../styles/";
import { useCodeInterval } from "../../hooks/codes";
import {
  generateTemporaryCode,
  waitForAuthorizeCode,
} from "../../services/api";

const initalMessage = "Make sure this is the device you want to login with.";

const OneTime = () => {
  const [username, setUsername] = useState("");
  const [setExpiresAt, setCode, message, code] = useCodeInterval(initalMessage);
  const history = useHistory();

  const handleUsernameInput = (event) => {
    setUsername(event.target.value);
  };

  const handleBack = () => {
    history.push("/");
  };

  const handleOneTimeAuthentication = async () => {
    try {
      const { code, expires_at: expiresAt } = await generateTemporaryCode(
        username
      );
      setExpiresAt(expiresAt);
      setCode(code);

      await waitForAuthorizeCode(username, code);

      history.push("/dashboard");
    } catch (e) {
      console.log(e);
      alert(e.message);
    }
  };

  return (
    <Wrapper>
      {code && <Message noSpacing>Authorize this code: {code}</Message>}
      <Message>{message}</Message>
      <Input
        placeholder="Username"
        value={username}
        onChange={handleUsernameInput}
      />
      <Button onClick={handleOneTimeAuthentication}>Generate Code</Button>
      <Button onClick={handleBack}>Go Back</Button>
    </Wrapper>
  );
};

export default OneTime;
