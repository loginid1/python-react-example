from flask import request
from flask_restful import Resource
from datetime import timedelta
from loginid import LoginID
from http import HTTPStatus
from server.helpers.api import json_response, default_json
from server.config import BASE_URL, WEB_CLIENT_ID, PRIVATE_KEY
from server.helpers.encodings import decoded_jwt
from flask_jwt_extended import (
    create_access_token,
    set_access_cookies,
    get_jwt_identity,
    jwt_required
)

loginid = LoginID(WEB_CLIENT_ID, PRIVATE_KEY, BASE_URL)


def userResponse(jwt: str):
    _, token_payload = decoded_jwt(jwt, PRIVATE_KEY)

    user_id, username = token_payload["sub"], token_payload["udata"]

    # you can do your database stuff here as well to create or retrieve a user
    user = {
        "username": username,
        "user_id": user_id
    }

    access_token = create_access_token(
        identity=user,
        expires_delta=timedelta(days=1)
    )

    response = json_response(user, HTTPStatus.OK)

    set_access_cookies(response, access_token)

    return response


class UserResource(Resource):
    @jwt_required()
    def get(self):
        user = get_jwt_identity()
        return json_response(user, HTTPStatus.OK)

    def post(self):
        payload = request.get_json()

        jwt = payload.get("jwt", "")

        jwt_is_valid = loginid.verifyToken(jwt)

        if jwt_is_valid is False:
            response_data = {"message": "Unauthorized"}
            return json_response(response_data, HTTPStatus.UNAUTHORIZED)

        return userResponse(jwt)


class TemporaryUser(Resource):
    def post(self):
        username, code = default_json("username", "code")

        err, wait = loginid.waitCode(username, code, "short")

        if err is not None:
            return json_response(wait, HTTPStatus.BAD_REQUEST)

        jwt = wait["jwt"]

        return userResponse(jwt)
