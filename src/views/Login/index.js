import WebSDK from "@loginid/sdk";
import { Wrapper, Input, Button, Image } from "./style";
import { env } from "../../utils/env";
import { authorizeUser } from "../../services/api";

const { baseUrl, webClientId } = env;

const logoUrl = "./imgs/loginid-logo.svg";
const sdk = new WebSDK(baseUrl, webClientId);

const Login = function ({ username, handleUsername }) {
  const handleRegister = async () => {
    try {
      const { jwt } = await sdk.registerWithFido2(username);
      await authorizeUser(jwt);
    } catch (e) {
      console.log(e);
      alert(e.message);
    }
  };

  const handleLogin = async () => {
    try {
      const { jwt } = await sdk.authenticateWithFido2(username);
      await authorizeUser(jwt);
    } catch (e) {
      console.log(e);
      alert(e.message);
    }
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
    </Wrapper>
  );
};

export default Login;
