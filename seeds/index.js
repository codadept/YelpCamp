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
                    author: '602c0a484a4b4618347c4013',                        
                    location:`${cities[random1000].city} , ${cities[random1000].state}`,
                    title: `${sample(descriptors)} ${sample(places)}`,
                    description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Veniam, suscipit ipsa repellat iure nam, voluptatum culpa placeat voluptas architecto at a consequatur temporibus ipsam quaerat necessitatibus! Eum sit quam totam cumque at vitae recusandae mollitia, consequatur, quasi sint nostrum atque iste laudantium dolore cum autem veritatis aspernatur ex corrupti quisquam?',
                    price: Math.floor(Math.random()*3000)+5000,
                    images:[
                        {
                                "url" : "https://res.cloudinary.com/dwjclhc8a/image/upload/v1613538191/YelpCamp/wcmwl6ajnv2fqazhkdyn.jpg",
                                "filename" : "YelpCamp/wcmwl6ajnv2fqazhkdyn"
                        },
                        {
                                "url" : "https://res.cloudinary.com/dwjclhc8a/image/upload/v1613538584/YelpCamp/odyxxufcsufdi48enaor.jpg",
                                "filename" : "YelpCamp/odyxxufcsufdi48enaor"
                        }
                ]
        })
        await camp.save()
    }
}

seedDb().then(()=>{
    mongoose.connection.close();
})