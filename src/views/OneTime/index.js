import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Wrapper, Button, Input, Message } from "../styles/";
import {
  generateTemporaryCode,
  waitForAuthorizeCode,
} from "../../services/api";

const initalMessage = "Make sure this is the device you want to login with.";

const OneTime = () => {
  const [username, setUsername] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [message, setMessage] = useState(initalMessage);
  const history = useHistory();

  useEffect(() => {
    if (expiresAt) {
      /*
      const currentMil = Date.now();
      const timeLeft = new Date(new Date(expiresAt) - currentMil);
      console.log(timeLeft.getMilliseconds());
      setMessage(`${timeLeft.getMinutes()}:${timeLeft.getSeconds()}`);
		*/
    }
  }, [expiresAt]);

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
      setMessage(code);

      await waitForAuthorizeCode(username, code);

      history.push("/dashboard");
    } catch (e) {
      console.log(e);
      alert(e.message);
    }
  };

  return (
    <Wrapper>
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
