FROM node:carbon
WORKDIR /usr/src/app
COPY package*.json ./

RUN npm install --quiet

COPY . .
RUN chmod +x start.sh

CMD [ "./start.sh" ]