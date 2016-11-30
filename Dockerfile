FROM srijanss/iot-device:latest

# Bundle app source
COPY . /usr/src/app

EXPOSE 10010

CMD ["swagger", "project", "start"]
