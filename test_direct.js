const { MongoClient } = require('mongodb');
const uri = "mongodb://hyeonu:gusdn0505yjyj%40@ac-lpcxwnh-shard-00-00.wkmjoxh.mongodb.net:27017,ac-lpcxwnh-shard-00-01.wkmjoxh.mongodb.net:27017,ac-lpcxwnh-shard-00-02.wkmjoxh.mongodb.net:27017/?ssl=true&replicaSet=atlas-lmoykk-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri);
async function run() {
    try {
        await client.connect();
        await client.db("admin").command({ ping: 1 });
        console.log("성공! Non-SRV 주소로 연결되었습니다.");
    } finally {
        await client.close();
    }
}
run().catch(console.dir);
