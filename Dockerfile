FROM node:12.18.3-alpine

# 安装时区组件
RUN apk add tzdata --no-cache

ENV TZ=Asia/Shanghai EGG_WORKERS=2 EGG_SERVER_ENV=dev NODE_ENV=production

WORKDIR /app

# 安装npm-cli-login并登录
RUN npm i -g npm-cli-login --registry http://npm.vivo.com.cn/ && \
    npm-cli-login -u $NPM_USER_NAME -p $NPM_USER_PWD -e $NPM_USER_EMAIL -r http://npm.vivo.com.cn

# 先安装npm依赖，当依赖包没有变化时可以利用缓存，加快镜像构建
COPY package.json /app/
RUN npm i --registry http://npm.vivo.com.cn/

COPY . /app

# 启动后运行命令：发布正式版本、打tag并发布到npm
CMD npm run release && git push --follow-tags origin && npm publish --registry http://npm.vivo.com.cn/
