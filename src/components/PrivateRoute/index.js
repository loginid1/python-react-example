import React, { useState, useEffect } from "react";
import { Route, Redirect } from "react-router-dom";
import { getUser } from "../../services/api";

const Private = ({ path, children }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const init = async () => {
      try {
        const user = await getUser();
        setUser(user);
        setLoading(false);
      } catch (e) {
        console.log(e);
        setLoading(false);
      }
    };
    init();
  }, []);

  const Child = React.cloneElement(children, { user });

  return loading === true && user === null ? (
    <Route path={path} exact />
  ) : loading === false && user === null ? (
    <Redirect to="/" />
  ) : (
    Child
  );
};

export default Private;
