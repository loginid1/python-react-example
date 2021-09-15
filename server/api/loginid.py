from flask import request
from flask_restful import Resource
from loginid import LoginID
from server.helpers.api import json_response
from server.config import (
    BASE_URL,
    WEB_CLIENT_ID,
    PRIVATE_KEY
)

loginid = LoginID(WEB_CLIENT_ID, PRIVATE_KEY, BASE_URL)


class TokensResource(Resource):
    def post(self):
        payload = request.get_json()
        scope, username = payload["type"], payload["username"]
        tx_payload = payload.get("tx_payload", "")

        if tx_payload:
            service_token = loginid.generateTxAuthToken(tx_payload, username)
        else:
            service_token = loginid.generateServiceToken(
                scope,
                username=username
            )

        response = {"service_token": service_token}

        return json_response(response, 200)
