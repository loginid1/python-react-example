import jwt

def decoded_jwt(service_token: str, alg="ES256"):
    options = {
        "verify_signature": False
    }
    header = jwt.get_unverified_header(service_token)
    body = jwt.decode(service_token, options=options, algorithms=alg)
    return header, body
