FROM node:16-alpine
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
# 设置 RUN install 层值对比 package.json 和 package-lock.json 发生改变时执行, 其他层使用对应层缓存即可
COPY package.json /usr/src/app/
RUN npm install --registry=https://registry.npm.taobao.org
COPY . /usr/src/app/
# 运行前启动步骤
RUN npm run tsc
EXPOSE 7002
# 启动在前台
CMD npx egg-scripts start --title=lego-backend