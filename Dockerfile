FROM node:20.10.0

RUN npm i -g typescript tsx ts-node tsc-watch nodemon pm2 pm2-devmon npm@latest

RUN mkdir -p /app/web/
RUN mkdir -p /home/mauricio
RUN useradd mauricio

COPY ./back-end /app/web/back-end
COPY ./front-end /app/web/front-end
COPY ./start.sh /app/web/start.sh

RUN chmod 744 /app/web/start.sh
RUN chown -R mauricio:mauricio /app
RUN chown -R mauricio:mauricio /home/mauricio
USER mauricio

WORKDIR /app/web

EXPOSE ${WEB_PORT}

CMD ["/app/web/start.sh"]
