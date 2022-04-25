const fs = require('fs')
const { default: axios } = require("axios")

class Busquedas {

    historial = []
    dbPath = './db/database.json'

    constructor() {
        this.leerDB()
    }

    get paramsMapbox() {
        return {
            'access_token': process.env.MAPBOX_KEY,
            'language': 'es',
            'limit': 5
        }
    }

    get paramsWheatermap() {
        return {
            'appid': process.env.OPENWEATHER_KEY,
            'lang': 'es',
            'units': 'metric'
        }
    }
    

    get historialCapitalizado() {

        return this.historial.map(lugar => {

            let palabras = lugar.split(' ')
            palabras = palabras.map(p => p[0].toUpperCase() + p.substring(1))

            return palabras.join(' ')
        })



    }

    async ciudad(lugar = '') {

        try {

            // Peticion Http
            const intance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
                params: this.paramsMapbox
            })

            const { data } = await intance.get()
            return data.features.map(lugar => ({
                id: lugar.id,
                nombre: lugar.place_name,
                lgn: lugar.center[0],
                lat: lugar.center[1],
            })) // retornar los lugares
        } catch (error) {
            console.log(error)
            throw "Error en la consulta"
        }
    }


    async climaLugar(lat, lon) {

        try {
            // Peticion Http
            const intance = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}`,
                params: this.paramsWheatermap
            })

            const { data } = await intance.get()

            return {
                desc: data.weather[0].description,
                min: data.main.temp_min,
                max: data.main.temp_max,
                temp: data.main.temp
            }
        } catch (error) {
            throw "Error"
        }
    }

    agregarHistorial(lugar = '') {

        // Prevenir duplicados
        if (this.historial.includes(lugar.toLocaleLowerCase())) {
            return;
        }

        this.historial = this.historial.splice(0.4)

        this.historial.unshift(lugar.toLocaleLowerCase());

        // Grabar en DB
        this.guardarDB()

    }

    guardarDB() {

        const payload = {
            historial: this.historial
        }

        fs.writeFileSync(this.dbPath, JSON.stringify(payload))
    }

    leerDB() {

        if( !fs.existsSync( this.dbPath ) ) return;

        const db = fs.readFileSync(this.dbPath, { encoding: 'utf-8' })

        if (db) {
            const data = JSON.parse(db)
            this.historial = data.historial
            console.log(this.historial)
        }
        return
    }

}

module.exports = Busquedas