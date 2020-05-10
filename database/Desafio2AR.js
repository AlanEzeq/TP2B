// Alan Rosenberg (AR) Cree una coleccion alumnos en sample_training que contine documentos 
// también generé un índice unique x el campo nombre para que no me permita el alta duplicada (mongodb es responsable de ese control)
// además el indice me mejora la performance para el resto de las funciones CRUD.
// Doc: 
// https://docs.mongodb.com/manual/crud/
// https://docs.mongodb.com/stitch/mongodb/actions/collection.findOne/
// 
// 

const MongoClient = require('mongodb').MongoClient
const url = 'mongodb+srv://admin:alan2812@cluster0-4tlnj.mongodb.net/'
let database = null;

function consulta1(query) {
    MongoClient.connect(url, { useUnifiedTopology: true }) // AR El segundo parametro lo pide por un Warning
        .then(function (db) { // AR db es la conexion
            console.log('Pase por conexion');
            database = db;
            var dbo = db.db("sample_training");
            return dbo.collection('alumnos');  // AR devuelvo el resultado de la promesa
        })
        .then(function (alumnos) {  // AR Si cumple la promesa de conexion, alumnos es la colección devuelta
            console.log('Pase por then alumnos');
            alumnos.findOne(query).then(result => { // AR busco que el alumno exista
                if (result) {
                    console.log('El alumno es:');
                    console.log(result);
                } else {
                    console.log("No existe el alumno: " + query.nombre);
                }
                return result;
            }).then(function () { if (database)  database.close().then(console.log('La consulta funcionó Ok me desconecto!')) }) // AR por último si todo salio OK y se cerro la conexion lo informo
        })
        .catch(function (err) { // AR si hay algo mal, informo que paso y cierro la conexion
            if (database) {
                console.error(err.errmsg);
                database.close().then(console.log('No encontre la colección, me desconecto!'));
            }
            else console.error('No hay conexión para Consultas, verifique que pueda llegar a mongodb!');
        })
}

function consultaM(query) {
    MongoClient.connect(url, { useUnifiedTopology: true }) // AR El segundo parametro lo pide por un Warning
        .then(function (db) { // AR db es la conexion
            console.log('Pase por conexion');
            database = db;
            let dbo = db.db("sample_training");
            return dbo.collection('alumnos');  // AR devuelvo el resultado de la promesa
        })
        .then(function (alumnos) {  // AR Si cumple la promesa de conexion, alumnos es la colección devuelta
            console.log('Pase por then alumnos');
            return alumnos.find(query).toArray();
            }).then(items => { // AR busco que el alumno exista
                if (items.length > 0) {
                    console.log('El/los alumno/s es/son:');
                    console.log(items);
                } else {
                    console.log('No existen alumnos con este criterio');
                }
                return items;
                }).then(function () { if (database)  database.close().then(console.log('La consulta funcionó Ok me desconecto!')) 
            }) // AR por último si todo salio OK y se cerro la conexion lo informo
        .catch(function (err) { // AR si hay algo mal, informo que paso y cierro la conexion
            if (database) {
                console.error(err.errmsg);
                database.close().then(console.log('No encontre la colección, me desconecto!'));
            }
            else console.error('No hay conexión para Consultas, verifique que pueda llegar a mongodb!');
        })
}

function alta(alumno) {
    MongoClient.connect(url, { useUnifiedTopology: true }) // AR Este parametro lo pide por un Warning
        .then(function (db) { // AR db es la conexion
            console.log('Pase por conexion');
            database = db;
            var dbo = db.db("sample_training");
            return dbo.collection('alumnos');  // AR devuelvo el resultado de la promesa
        })
        .then(function (alumnos) {  // AR AR Si cumple la promesa de conexion, alumnos es la colección devuelta
            console.log('Pase por then alumnos');
            alumnos.insertOne(alumno).then(result => { // AR busco que el alumno exista
                if (result.insertedCount == 1) {
                    console.log('Se dió de alta a: ' + alumno.nombre + ' ID: ' + result.insertedId);
                    //                    console.log(result);
                } else {
                    console.log("No pude insertar el alumno: " + alumno.nombre);
                }
                return result;
            }).then(function () { if (database) database.close().then(console.log('El alta funcionó Ok me desconecto!')) })
                .catch(function (err) { // AR si no se cumple la promesa de alta informo el error
                    console.error(err.errmsg);
                    if (database) database.close().then(console.log('Sin dar el alta, me desconecto!'));
                })
            //Salio OK y se cerro la conexion lo informo
        })
        .catch(function (err) { // AR si hay algo mal, informo que paso y cierro la conexion
            if (database) {
                console.error(err.errmsg);
                database.close().then(console.log('No encontre la colección, me desconecto!'));
            }
            else console.error('No hay conexión para Altas, verifique que pueda llegar a mongodb!');
        })
}

function baja(query) {
    MongoClient.connect(url, { useUnifiedTopology: true }) // AR Este parametro lo pide por un Warning
        .then(function (db) { // AR db es la conexion
            console.log('Pase por conexion');
            database = db;
            var dbo = db.db("sample_training");
            return dbo.collection('alumnos');  // AR devuelvo el resultado de la promesa
        })
        .then(function (alumnos) {  // AR AR Si cumple la promesa de conexion, alumnos es la colección devuelta
            console.log('Baja: conexion ok !');
            alumnos.deleteOne(query).then(result => { // AR doy de baja al alumno
                if (result.deletedCount === 1) {
                    console.log('El alumno : ' + query.nombre + ' dado de baja.');
                    console.log('Se elimino ' + result.deletedCount + ' documento');
                } else {
                    console.log("No existe el alumno: " + query.nombre);
                }
                return result;
            }).then(function () { if (database) database.close().then(console.log('La baja funcionó Ok me desconecto!')) }) // AR por último si todo salio OK y se cerro la conexion lo informo
        })
        .catch(function (err) { // AR si hay algo mal, informo que paso y cierro la conexion
            if (database) {
                console.error(err.errmsg);
                database.close().then(console.log('No encontre la colección, me desconecto!'));
            }
            else console.error('No hay conexión para Bajas, verifique que pueda llegar a mongodb!');
        })
}

function modificacion(query, valores) {
    MongoClient.connect(url, { useUnifiedTopology: true }) // AR Este parametro lo pide por un Warning
        .then(function (db) { // AR db es la conexion
            console.log('Pase por conexion');
            database = db;
            var dbo = db.db("sample_training");
            return dbo.collection('alumnos');  // AR devuelvo el resultado de la promesa
        })
        .then(function (alumnos) {  // AR AR Si cumple la promesa de conexion,alumnos es la colección devuelta
            console.log('Pase por modificacion');
            var nuevosValores = { $set: valores };
            alumnos.updateOne(query, nuevosValores).then(result => { // AR busco que el alumno exista
                if (result.modifiedCount == 1) {
                    console.log('Alumno: ' + query.nombre + ' modificado ');
                } else {
                    console.log("No existe el alumno: " + query.nombre);
                }
                return result;
            }).then(function () { if (database) database.close().then(console.log('La modificación funcionó Ok me desconecto!')) }) // AR por último si todo salio OK y se cerro la conexion lo informo
        })
        .catch(function (err) { // AR si hay algo mal, informo que paso y cierro la conexion
            if (database) {
                console.error(err.errmsg);
                database.close().then(console.log('No encontre la colección, me desconecto!'));
            }
            else console.error('No hay conexión para Modificaciones, verifique que pueda llegar a mongodb!');
        })
}

consultaM({ edad: 54 });

setTimeout((espero) => {
    alta({ "nombre": "Hernan", "aula": "B3", "edad": 54, "fecha_nacimiento": { "date": "1964-10-29T06:51:27.000Z" }, "Sexo": "H" });
}, 3000);

setTimeout((espero) => {
    consulta1({ nombre: "Hernan" });
}, 6000);

setTimeout((espero) => {
    baja({ nombre: "Hernan" });
}, 9000);

setTimeout((espero) => {
    modificacion({ nombre: "Alan" },{edad: 30});
}, 12000);