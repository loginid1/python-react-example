import WebSDK from "@loginid/sdk";
import { useHistory } from "react-router-dom";
import { Wrapper, Input, Button, Image } from "../styles/";
import { env } from "../../utils/env";
import { authorizeUser, createServiceToken } from "../../services/api";

const { baseUrl, webClientId } = env;

const logoUrl = process.env.PUBLIC_URL + "/imgs/loginid-logo.svg";
const sdk = new WebSDK(baseUrl, webClientId);

const Login = function ({ username, handleUsername }) {
  const history = useHistory();

  const handleRegister = async () => {
    try {
      const { service_token: serviceToken } = await createServiceToken(
        "auth.register",
        username
      );

      const { jwt } = await sdk.registerWithFido2(username, {
        authorization_token: serviceToken,
      });

      await authorizeUser(jwt);

      history.push("/dashboard");
    } catch (e) {
      console.log(e);
      alert(e.message);
    }
  };

  const handleLogin = async () => {
    try {
      const { service_token: serviceToken } = await createServiceToken(
        "auth.login",
        username
      );

      const { jwt } = await sdk.authenticateWithFido2(username, {
        authorization_token: serviceToken,
      });

      await authorizeUser(jwt);

      history.push("/dashboard");
    } catch (e) {
      console.log(e);
      alert(e.message);
    }
  };

  const handleOneTimeAuthentication = () => {
    history.push("/push");
  };

  const handleAddCredential = () => {
    history.push("/add_credential");
  };

  const handleAuthorizeCode = () => {
    history.push("/authorize");
  };

  return (
    <Wrapper>
      <Image src={logoUrl} alt="Logo" />
      <Input
        type="text"
        placeholder="Username"
        value={username}
        onChange={handleUsername}
      />
      <Button onClick={handleRegister}>Register</Button>
      <Button onClick={handleLogin}>Login</Button>
      <Button onClick={handleOneTimeAuthentication}>
        One-Time Authentication
      </Button>
      <Button onClick={handleAddCredential}>Add Credential</Button>
      <Button onClick={handleAuthorizeCode}>Authorize Code</Button>
    </Wrapper>
  );
};

export default Login;
