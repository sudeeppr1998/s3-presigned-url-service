FROM node:16.13.2

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .

# Set environment variables
ENV AWS_ACCESS_KEY_ID=
ENV AWS_SECRET_ACCESS_KEY=
ENV AWS_s3_BUCKET_NAME=
ENV AWS_S3_REGION=

EXPOSE 3005
CMD [ "node", "index.js" ]