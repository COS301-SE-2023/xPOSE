FROM python:3.9

# Install necessary development libraries
RUN apt-get update && \
    apt-get install -y python3-dev default-libmysqlclient-dev build-essential

ENV PYTHONUNBUFFERED 1
WORKDIR /app
COPY requirements.txt .

RUN pip install -r requirements.txt
COPY . .
CMD python index.py
