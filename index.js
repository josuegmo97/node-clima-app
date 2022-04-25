require('dotenv').config()
const { leerInput, inquirerMenu, pausa, listarLugares } = require("./helpers/inquirer")
const Busquedas = require("./models/busquedas")

const main = async () => {

    const busquedas = new Busquedas();
    let opt = ''

    do {
        opt = await inquirerMenu()

        switch (opt) {
            case 1:
                // Mostrar mensaje
                const search = await leerInput('Ciudad: ');
                // Buscar los lugares
                const lugares = await busquedas.ciudad(search)
                const id = await listarLugares(lugares)
                if (id === '0') continue

                // Seleccionar el lugar
                const lugarSel = lugares.find(l => l.id === id)
                //Guadar en db
                busquedas.agregarHistorial(lugarSel.nombre)
                // Clima
                const clima = await busquedas.climaLugar(lugarSel.lat, lugarSel.lgn)

                // Mostrar resultados
                console.clear()
                console.log("\nInformacion de la ciudad\n".green)
                console.log("Ciudad: ".cyan, lugarSel.nombre)
                console.log("Lat: ".cyan, lugarSel.lat)
                console.log("Lng: ".cyan, lugarSel.lgn)
                console.log("Descripcion: ".cyan, clima.desc)
                console.log("Temperatura: ".cyan, clima.temp)
                console.log("Minima: ".cyan, clima.min)
                console.log("Maxima: ".cyan, clima.max)

                break;

            case 2:
                // Historial
                busquedas.historialCapitalizado.forEach((lugar,i) => {
                    const idx = `${i + 1}.`.green
                    console.log(idx + " " + lugar)
                })
                break;

        }

        if (opt !== 0) await pausa()
    } while (opt !== 0)
}

main()