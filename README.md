### python-react-example

## Requirements

- Nodejs
- npm
- Python

## env

A .env file is needed in the directory with the following:

```
REACT_APP_BASE_URL=                  #This is the base url value found on the dashboard.
REACT_APP_WEB_CLIENT_ID=             #This is a Web client ID.
MANAGEMENT_CLIENT_ID=                #This is a Backend client ID with a credential attached to it.
PRIVATE_KEY=                         #This is the private key associated with <MANAGEMENT_CLIENT_ID>.
```

If `REACT_APP_WEB_CLIENT_ID` is a private application(credential attached), make sure that it uses the same `PRIVATE_KEY` as `MANAGEMENT_CLIENT_ID`.

## How to Run

```
git clone https://github.com/loginid1/python-react-example.git
cd python-react-example
```

### Installing/Running Backend Server

```
pip install -r requirements.txt
flask run
```

### Installing Frontend Server

```
npm install
npm start
```

Project will now be found at [http://localhost:3000](http://localhost:3000).

## How to Run with Docker

1. Create and fill up .env file from above.
2. Enter `docker-compose up`
3. Project will now be found at [http://localhost:3000](http://localhost:3000).
