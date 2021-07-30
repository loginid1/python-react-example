import { Wrapper, Input, Button, Image } from "./style";

const logoUrl = "./imgs/loginid-logo.svg";

const Login = function () {
  return (
    <Wrapper>
      <Image src={logoUrl} alt="Logo" />
      <Input type="text" placeholder="Username" />
      <Button>Register</Button>
      <Button>Login</Button>
    </Wrapper>
  );
};

export default Login;
