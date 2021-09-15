from flask import Blueprint, request
from http import HTTPStatus
from loginid import LoginID
from server.helpers.api import json_response
from server.config import (
    BASE_URL,
    WEB_CLIENT_ID,
    PRIVATE_KEY
)

loginid = LoginID(WEB_CLIENT_ID, PRIVATE_KEY, BASE_URL)

loginid_blueprint = Blueprint("loginid", __name__, url_prefix="/api")


@loginid_blueprint.route("/token", methods=["POST"])
def create_service_token():
    payload = request.get_json()
    username = payload["username"]
    scope = payload.get("type", "")
    tx_payload = payload.get("tx_payload", "")

    if tx_payload:
        service_token = loginid.generateTxAuthToken(tx_payload, username)
    else:
        service_token = loginid.generateServiceToken(
            scope,
            username=username
        )

    response = {"service_token": service_token}

    return json_response(response, HTTPStatus.OK)


@loginid_blueprint.route("/tx", methods=["POST"])
def create_transaction():
    payload = request.get_json()
    tx_payload, username = payload["tx_payload"], payload["username"]

    err, tx_id = loginid.createTx(tx_payload, username)
    response = {}

    if type(err) is int:
        response["message"] = "Could not create Transaction"
        return json_response(response, err)

    response["tx_id"] = tx_id

    return json_response(response, HTTPStatus.OK)


@loginid_blueprint.route("/tx/verify", methods=["POST"])
def verify_tx():
    payload = request.get_json()
    tx_token, tx_payload = payload["jwt"], payload["tx_payload"]

    err, is_valid = loginid.verifyTransaction(tx_token, tx_payload)

    if type(err) is int:
        return json_response(is_valid, err)

    response = {"is_valid": is_valid}

    return response, HTTPStatus.OK
