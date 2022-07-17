FROM node:16
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY . /usr/src/app/
# 运行前启动步骤
RUN npm install --registry=https://registry.npm.taobao.org
RUN npm tsc
EXPOSE 7001
# 启动在前台
CMD npx egg-scripts start --title=lego-backend