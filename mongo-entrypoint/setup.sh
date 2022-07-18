#!/bin/bash
# shell 脚本中发生错误, 即命令返回值不等于 0, 则停止执行并退出 shell
set -e

mongo <<EOF
use admin
db.auth('$MONGO_INITDB_ROOT_USERNAME', '$MONGO_INITDB_ROOT_PASSWORD')
use lego
db.createUser({
    user: '$MONGO_DB_USERNAME',
    pwd: '$MONGO_DB_PASSWORD',
    roles: [{ role: 'readWrite', db: 'lego' }]
})
db.createCollection('works')
db.works.insertMany([
    {
        id:20,
        title: 'yyds222'
    }
])
EOF