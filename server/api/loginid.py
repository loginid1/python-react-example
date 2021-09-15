from flask import Blueprint
from http import HTTPStatus
from loginid import LoginID, LoginIdManagement
from server.helpers.api import json_response, default_json
from server.config import (
    BASE_URL,
    WEB_CLIENT_ID,
    MANAGEMENT_CLIENT_ID,
    PRIVATE_KEY
)

loginid_blueprint = Blueprint("loginid", __name__, url_prefix="/api")
loginid = LoginID(WEB_CLIENT_ID, PRIVATE_KEY, BASE_URL)
loginid_management = LoginIdManagement(
    MANAGEMENT_CLIENT_ID,
    PRIVATE_KEY,
    BASE_URL
)


@loginid_blueprint.route("/token", methods=["POST"])
def create_service_token():
    username, scope, tx_payload = default_json(
        "username",
        "type",
        "tx_payload"
    )

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
    tx_payload, username = default_json("tx_payload", "username")

    err, tx_id = loginid.createTx(tx_payload, username)
    response = {}

    if type(err) is int:
        response["message"] = "Could not create Transaction"
        return json_response(response, err)

    response["tx_id"] = tx_id

    return json_response(response, HTTPStatus.OK)


@loginid_blueprint.route("/tx/verify", methods=["POST"])
def verify_tx():
    tx_token, tx_payload = default_json("jwt", "tx_payload")

    err, is_valid = loginid.verifyTransaction(tx_token, tx_payload)

    if type(err) is int:
        return json_response(is_valid, err)

    response = {"is_valid": is_valid}

    return response, HTTPStatus.OK


@loginid_blueprint.route("/codes/generate", methods=["POST"])
def generate_code():
    code_purpose, username = default_json("purpose", "username")

    err, user_id = loginid_management.getUserId(username)
    if type(err) is int:
        return json_response(user_id, err)

    err, code_response = loginid_management.generateCode(
        user_id,
        codeType="short",
        codePurpose=code_purpose,
        isAuthorized=False
    )
    if type(err) is int:
        return json_response(user_id, err)

    return json_response(code_response, HTTPStatus.OK)


@loginid_blueprint.route("/codes/authorize", methods=["POST"])
def authorize_code():
    code, username = default_json("code", "username")

    err, user_id = loginid_management.getUserId(username)
    if type(err) is int:
        return json_response(user_id, err)

    '''
    not the best way to do this but you can use a database to
    store the code purpose to a user or obtain the purpose from the client
    '''
    err, _ = loginid_management.authorizeCode(
        user_id,
        code,
        codeType="short",
        codePurpose="temporary_authentication"
    )
    if err is None:
        return "", HTTPStatus.NO_CONTENT

    err, _ = loginid_management.authorizeCode(
        user_id,
        code,
        codeType="short",
        codePurpose="add_credential"
    )
    if err is None:
        return "", HTTPStatus.NO_CONTENT

    error_response = {"message": "Code could not be authorized"}
    return json_response(error_response, HTTPStatus.BAD_REQUEST)
