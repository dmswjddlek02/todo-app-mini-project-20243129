const { MongoClient, ServerApiVersion } = require('mongodb');
// 비밀번호가 'gusdn0505yjyj@' 인 경우:
const uri = "mongodb://20243129_db_user:p3Z3aB6DsELVVLAO@ac-3rmc3mj-shard-00-00.rqk2s3o.mongodb.net:27017,ac-3rmc3mj-shard-00-01.rqk2s3o.mongodb.net:27017,ac-3rmc3mj-shard-00-02.rqk2s3o.mongodb.net:27017/?ssl=true&replicaSet=atlas-nmspa1-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0";


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}
run().catch(console.dir);
