from flask_restful import Resource
from flask import jsonify
from flask_jwt_extended import unset_jwt_cookies

class LogoutResource(Resource):
    def post(self):
        response = jsonify(logout=True)
        unset_jwt_cookies(response)
        return response
