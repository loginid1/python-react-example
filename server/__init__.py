from flask import Flask
from flask_jwt_extended import JWTManager
from flask_restful import Api
from server.api.users import UserResource

def create_app():
    app = Flask(__name__)
    # change to True in production setting
    app.config["JWT_COOKIE_SECURE"] = False
    app.config["JWT_ACCESS_COOKIE_PATH"] = "/"
    app.config["JWT_COOKIE_CSRF_PROTECT"] = True
    app.config["JWT_CSRF_IN_COOKIES"] = True
    app.config["JWT_SECRET_KEY"] = "loginid"
    JWTManager(app)

    api = Api(app)
    api.add_resource(UserResource, "/api/users")

    return app
