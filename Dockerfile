FROM node:10

EXPOSE 3000
CMD npm start app.js

WORKDIR /app                                                                                                                                                                                                                                COPY: package.json /app                                                                                                                                                                                                                      RUN npm install                                                                                                                                                                                                                              COPY . /app                                                                                                                                                                                                                                  CMD npm start app.js                                                                                                                                                                                                                         EXPOSE 3000  FROM node:10

COPY package*.json /app/
RUN npm install

COPY . /app