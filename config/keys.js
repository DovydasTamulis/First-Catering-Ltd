dbPassword = 'mongodb://admin:'+ 'admin' +'@ecardcluster-shard-00-00-nkjuw.mongodb.net:27017,ecardcluster-shard-00-01-nkjuw.mongodb.net:27017,ecardcluster-shard-00-02-nkjuw.mongodb.net:27017/test?ssl=true&replicaSet=ECardCluster-shard-0&authSource=admin&retryWrites=true';

module.exports = {
    mongoURI: dbPassword
};
