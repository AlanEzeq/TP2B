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

async function consulta1(query) {
    await new Promise(function (resolve, reject) { // AR la transformo en promesa para poder usar await
        MongoClient.connect(url, { useUnifiedTopology: true }) // AR El segundo parametro lo pide por un Warning
            .then(function (db) { // AR db es la conexion
                console.log('Pase por conexion consulta1');
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
                })
                    .then(function () {
                        if (database) {
                            database.close().then(console.log('La consulta funcionó Ok me desconecto!'));
                            resolve("Termino Ok Consulta1 !");
                        }
                    }) // AR por último si todo salio OK y se cerro la conexion lo informo
            })
            .catch(function (err) { // AR si hay algo mal, informo que paso y cierro la conexion
                if (database) {
                    console.error(err.errmsg);
                    database.close().then(console.log('No encontre la colección, me desconecto!'));
                }
                else console.error('No hay conexión para Consultas, verifique que pueda llegar a mongodb!');
            })

    })

}


async function consultaM(query) {
    await new Promise(function (resolve, reject) { // AR la transformo en promesa para poder usar await

        MongoClient.connect(url, { useUnifiedTopology: true }) // AR El segundo parametro lo pide por un Warning
            .then(function (db) { // AR db es la conexion
                console.log('Pase por conexion consultaM');
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
            }).then(function () {
                if (database) {
                    database.close().then(console.log('La consulta funcionó Ok me desconecto!'));
                    resolve("Termino Ok ConsultaM !");
                }
            }) // AR por último si todo salio OK y se cerro la conexion lo informo
            .catch(function (err) { // AR si hay algo mal, informo que paso y cierro la conexion
                if (database) {
                    console.error(err.errmsg);
                    database.close().then(console.log('No encontre la colección, me desconecto!'));
                    resolve("Algo salio mal !");
                }
                else console.error('No hay conexión para Consultas, verifique que pueda llegar a mongodb!');
            })

    })

}

async function alta(alumno) {
    await new Promise(function (resolve, reject) { // AR la transformo en promesa para poder usar await
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

                }).then(function () {
                    if (database) {
                        database.close().then(console.log('El alta funcionó Ok me desconecto!'));
                        resolve("Termino Ok Alta !");
                    }
                })
                    .catch(function (err) { // AR si no se cumple la promesa de alta informo el error
                        console.error(err.errmsg);
                        if (database) database.close().then(console.log('Sin dar el alta, me desconecto!'));
                        resolve("Algo salio mal !");
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
    })

}

async function baja(query) {
    await new Promise(function (resolve, reject) { // AR la transformo en promesa para poder usar await
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
                }).then(function () {
                    if (database) {
                        database.close().then(console.log('La baja funcionó Ok me desconecto!'));
                        resolve("Termino Ok Alta !");
                    }
                }) // AR por último si todo salio OK y se cerro la conexion lo informo
            })
            .catch(function (err) { // AR si hay algo mal, informo que paso y cierro la conexion
                if (database) {
                    console.error(err.errmsg);
                    database.close().then(console.log('No encontre la colección, me desconecto!'));
                    resolve("Algo salio mal !");
                }
                else console.error('No hay conexión para Bajas, verifique que pueda llegar a mongodb!');
            })
    })
}

async function modificacion(query, valores) {
    await new Promise(function (resolve, reject) { // AR la transformo en promesa para poder usar await
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

                }).then(function () {
                    if (database) {
                        database.close().then(console.log('La modificación funcionó Ok me desconecto!'));
                        resolve("Termino Ok Alta !");
                    }
                }) // AR por último si todo salio OK y se cerro la conexion lo informo
            })
            .catch(function (err) { // AR si hay algo mal, informo que paso y cierro la conexion
                if (database) {
                    console.error(err.errmsg);
                    database.close().then(console.log('No encontre la colección, me desconecto!'));
                    resolve("Algo salio mal !");
                }
                else console.error('No hay conexión para Modificaciones, verifique que pueda llegar a mongodb!');
            })
    })
}

// consulta1({ nombre: "Hernan" })
//  .then(function () { 
//     consultaM({ edad: 54 });
//  })


async function correPromesas() {
    try {
        console.log("======================= 1");
        await consulta1({ nombre: "Hernan" });
        console.log("======================= 2");
        await consultaM({ edad: 54 });
        console.log("======================= 3");
        await alta({ "nombre": "Hernan", "aula": "B3", "edad": 54, "fecha_nacimiento": { "date": "1964-10-29T06:51:27.000Z" }, "Sexo": "H" });
        console.log("======================= 4");
        await consulta1({ nombre: "Hernan" });
        console.log("======================= 5");
        await baja({ nombre: "Rolando" });
        console.log("======================= 6");
        await modificacion({ nombre: "Alan" }, { edad: 32 });
        console.log("======================= Fin !");
    }
    catch (err) {
        console.log(err);
    }
}

correPromesas();


// setTimeout((espero) => {
//     alta({ "nombre": "Hernan", "aula": "B3", "edad": 54, "fecha_nacimiento": { "date": "1964-10-29T06:51:27.000Z" }, "Sexo": "H" });
// }, 3000);

// setTimeout((espero) => {
//     consulta1({ nombre: "Hernan" });
// }, 6000);

// setTimeout((espero) => {
//     baja({ nombre: "Hernan" });
// }, 9000);

// setTimeout((espero) => {
//     modificacion({ nombre: "Alan" },{edad: 30});
// }, 12000);
