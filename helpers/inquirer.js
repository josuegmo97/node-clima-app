const inquirer = require('inquirer')
require('colors')

const menuOptsPreguntas = [
    {
        type: 'list',
        name: 'opcion',
        message: '¿Que desea hacer?',
        choices: [
            { value: 1, name: `${'1.'.green} Buscar ciudad` },
            { value: 2, name: `${'2.'.green} Historial` },
            { value: 0, name: `${'0.'.green} Salir` },
        ]
    }
]

const inquirerMenu = async () => {

    console.clear()

    console.log("========================".green)
    console.log("  Seleccione una opcion ".white)
    console.log("========================\n".green)

    const { opcion } = await inquirer.prompt(menuOptsPreguntas)
    return opcion
}

const pausa = async () => {

    console.log('\n')
    await inquirer.prompt(
        {
            type: 'input',
            name: 'enter',
            message: `Presiona ${'ENTER'.green} para continuar`,
        }
    )


}

const leerInput = async (message) => {

    const question = [
        {
            type: 'input',
            name: 'desc',
            message,
            validate(value) {
                if (value.length === 0) {
                    return "Por favor ingrese un valor"
                } return true
            }
        }
    ]

    const { desc } = await inquirer.prompt(question)
    return desc

}

const listarLugares = async (lugares = []) => {

    const choices = lugares.map((lugar, idx) => {

        const i = `${idx + 1}`.green

        return {
            value: lugar.id,
            name: `${i} ${lugar.nombre}`
        }

    })

    choices.unshift({
        value: '0',
        name: '0'.green + ' Cancelar'
    })

    console.clear()

    console.log("========================".green)
    console.log("  Seleccione una opcion ".white)
    console.log("========================\n".green)

    const question = [
        {
            type: 'list',
            name: 'id',
            message: 'Seleccione lugar',
            choices
        }
    ]

    const { id } = await inquirer.prompt(question)
    return id

}

const confirmar = async (msg) => {
    const question = [
        {
            type: 'confirm',
            name: 'ok',
            message: msg
        }
    ]

    const { ok } = await inquirer.prompt(question)
    return ok
}

const mostrarListadoCheckList = async (tareas = []) => {

    const choices = tareas.map((tarea, idx) => {

        const i = `${idx + 1}`.green

        return {
            value: tarea.id,
            name: `${i} ${tarea.desc}`,
            checked: (tarea.completadoEn) ? true : false
        }

    })

    console.clear()

    console.log("========================".green)
    console.log("    Opcion a Elminar ".white)
    console.log("========================\n".green)

    const question = [
        {
            type: 'checkbox',
            name: 'ids',
            message: 'Selecciones',
            choices
        }
    ]

    const { ids } = await inquirer.prompt(question)
    return ids

}

module.exports = {
    inquirerMenu,
    pausa,
    leerInput,
    listarLugares,
    confirmar,
    mostrarListadoCheckList
}