/* eslint-disable */
//  链接数据库
let db = connect('mongodb://admin:pass@localhost:27017/admin')
//  选择数据库lego
db.getSiblingDB('lego')
//  创建一个 lego 的管理用户
db.createUser({
    user: 'user',
    pwd: 'pass',
    roles: [{ role: 'readWrite', db: 'lego' }]
})
//  添加测试数据
db.createCollection('works')
db.works.insertOne({
    id: 10,
    title: '1024 yyds'
})