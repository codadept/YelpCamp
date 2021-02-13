const   mongoose                = require('mongoose'),
        Campground              = require('../models/campground'),
        cities                  = require('./cities'),
        {places, descriptors}   = require('./seedHelpers')

mongoose.connect("mongodb://localhost:27017/yelp-camp",{
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology:true
})

const db =  mongoose.connection;
db.on('error', console.error.bind(console,"connection error:"));
db.once("open",()=>{
    console.log("Database connected")
})

const sample = (array) =>{
    return array[Math.floor(Math.random()*array.length)];
}

const seedDb = async ()=>{
    await Campground.deleteMany({})
    for(let i = 0; i< 50;i++){
        const   random1000 = Math.floor(Math.random()*1000),
                camp = new Campground({
            location:`${cities[random1000].city} , ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`
        })
        await camp.save()
    }
}

seedDb().then(()=>{
    mongoose.connection.close();
})