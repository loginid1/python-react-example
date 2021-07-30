from flask import request
from flask_restful import Resource
from flask_jwt_extended import create_access_token, set_access_cookies
from datetime import timedelta
from loginid import LoginID
from server.helpers.api import json_response
from server.config import BASE_URL, WEB_CLIENT_ID, PRIVATE_KEY


loginid = LoginID(WEB_CLIENT_ID, PRIVATE_KEY, BASE_URL)

class UserResource(Resource):
    def post(self):
        payload = request.get_json()

        jwt = payload.get("jwt", "")

        jwt_is_valid = loginid.verifyToken(jwt)

        if jwt_is_valid is False:
            response_data = { "message": "Unauthorized" }
            return json_response(response_data, 401)

        user_id, username = jwt["sub"], jwt["udata"]

        # you can do your database stuff here as well
        user = {
            "id": user_id,
            "username": username
        }

        access_token = create_access_token(
            identity=user,
            expires_delta=timedelta(days=1)
        )

        response_data = { "user": user }
        response = json_response(response_data, 201)

        set_access_cookies(response, access_token)

        return response

