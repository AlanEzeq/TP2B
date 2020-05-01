db = db.getSiblingDB('sample_betp2');
db.inventors.drop();
db.inventors.insertMany([
    {"_id":1,"first":"Albert","last":"Einstein","year":1879},
    {"_id":2,"first":"Isaac","last":"Newton","year":1643},
    {"_id":3,"first":"Galileo","last":"Galilei","year":1564},
    {"_id":4,"first":"Marie","last":"Curie","year":1867},
    {"_id":5,"first":"Johannes","last":"Kepler","year":1571},
    {"_id":6,"first":"Nicolaus","last":"Copernicus","year":1473},
    {"_id":7,"first":"Max","last":"Planck","year":1858},
    {"_id":8,"first":"Pablo","last":"Fernandez","year":1976}
]);