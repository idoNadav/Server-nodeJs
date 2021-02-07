const mongodb =require('mongoose');
const URI = 'mongodb+srv://idoo1231:idoo1231@cluster0.k6oln.mongodb.net/users?retryWrites=true&w=majority';

module.exports = async () =>{
    await mongodb.connect(URI ,{useNewUrlParser:true , useUnifiedTopology:true , useFindAndModify: false});
    return mongodb;
}
