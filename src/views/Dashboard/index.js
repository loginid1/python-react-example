import React from "react";
import { useHistory } from "react-router-dom";
import { Wrapper, Button, H2 } from "../styles/";
import { logoutUser } from "../../services/api";

const Dashboard = ({ user: { username } }) => {
  const history = useHistory();
  const handleLogout = async () => {
    try {
      await logoutUser();
      history.push("/");
    } catch (e) {
      console.log(e);
      alert(e.message);
    }
  };

  return (
    <Wrapper>
      <H2>Welcome {username}</H2>
      <Button onClick={handleLogout}>Log Out</Button>
    </Wrapper>
  );
};

export default Dashboard;
