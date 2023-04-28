const mongoose = require('mongoose');
const connectDB = async () => {
    try{
        const connect = await mongoose.connect("mongodb+srv://prakashchitwan38:$Kathmandu07@pt-projects-mndb.ssp3mqr.mongodb.net/loginform?retryWrites=true&w=majority");
        console.log("DB is successfully connected at host:",
        connect.connection.host, ", DatabaseName: ",
        connect.connection.name)
    }catch(err){
        console.log(err);
    }
}

module.exports = connectDB;