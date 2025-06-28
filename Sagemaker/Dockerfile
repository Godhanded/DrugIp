# create a docker file to copy all files in the current directory to the docker image and run the python api script using gunicorn ,the api is in app.py and the requirements are in requirements.txt
FROM python:3.11-slim
# Install necessary system dependencies
RUN apt-get update && \
    apt-get install -y build-essential && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*
# Set the working directory
WORKDIR /app
# Copy the requirements file and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
# Copy the rest of the application code
COPY . .
# Expose the port the app runs on
EXPOSE 5000
# Set the command to run the application using gunicorn
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "app:app"]
# Note: Ensure that your app.py file contains a Flask or FastAPI application instance named 'app'
# If you are using Flask, it should look like this:
# from flask import Flask
# app = Flask(__name__)
# If you are using FastAPI, it should look like this:
# from fastapi import FastAPI
# app = FastAPI()
