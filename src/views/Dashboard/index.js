import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import WebSDK from "@loginid/sdk";
import * as uuid from "uuid";
import { Wrapper, Button, H2, Input, Message } from "../styles/";
import { env } from "../../utils/env";
import {
  createTx,
  createTxServiceToken,
  logoutUser,
  verifyTx,
} from "../../services/api";

const { baseUrl, webClientId } = env;
const sdk = new WebSDK(baseUrl, webClientId);

const Dashboard = ({ user: { username } }) => {
  const [txPayload, setTxPayload] = useState("");
  const [txId, setTxId] = useState("");
  const [message, setMessage] = useState("");
  const history = useHistory();

  const handleTxPayload = (event) => {
    setTxPayload(event.target.value);
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      history.push("/");
    } catch (e) {
      console.log(e);
      alert(e.message);
    }
  };

  const handleCreateTransaction = async () => {
    try {
      const { tx_id: txId } = await createTx(txPayload, username);
      setTxId(txId);
      setMessage(`Transaction ID: ${txId}`);
    } catch (e) {
      console.log(e);
      alert(e.message);
    }
  };

  const handleConfirmTransaction = async () => {
    if (!txId) {
      setMessage("Transaction needs to be created.");
      return;
    }

    if (!txPayload) {
      setMessage("Transaction payload needs to be set.");
      return;
    }

    try {
      const { jwt } = await sdk.confirmTransaction(username, txId);
      const { is_valid: isValid } = await verifyTx(jwt, txPayload);

      if (isValid) {
        setMessage(`Transaction Confirmed (${txId})`);
        setTxId("");
      } else {
        setMessage("Transaction is invalid.");
      }
    } catch (e) {
      console.log(e);
      alert(e.message);
    }
  };

  const handleCreateAndConfirmTransaction = async () => {
    if (!txPayload) {
      setMessage("Transaction payload needs to be set.");
      return;
    }

    try {
      const { service_token: serviceToken } = await createTxServiceToken(
        txPayload,
        username
      );

      const { jwt } = await sdk.createAndConfirmTransaction(
        username,
        txPayload,
        {
          authorization_token: serviceToken,
          nonce: uuid.v4(),
        }
      );

      const { is_valid: isValid } = await verifyTx(jwt, txPayload);

      if (isValid) {
        setMessage(`Transaction Confirmed!`);
        setTxId("");
      } else {
        setMessage("Transaction is invalid.");
      }
    } catch (e) {
      console.log(e);
      alert(e.message);
    }
  };

  return (
    <Wrapper>
      <H2>Welcome {username}</H2>
      {message && <Message>{message}</Message>}
      <Input
        placeholder="Transaction Payload"
        value={txPayload}
        onChange={handleTxPayload}
      />
      <Button onClick={handleCreateTransaction}>Create Transaction</Button>
      <Button onClick={handleConfirmTransaction}>Confirm Transaction</Button>
      <Button onClick={handleCreateAndConfirmTransaction}>
        Create and Confirm Transaction
      </Button>
      <Button onClick={handleLogout}>Log Out</Button>
    </Wrapper>
  );
};

export default Dashboard;
