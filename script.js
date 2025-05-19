let booleanValidation
let isEmailValid
let isLadaValid
let isNombreValido
let isNumberValid


function handleForm(formId, extraData, idModal, idSuffix) {
    const form = document.getElementById(formId)
    if (!form) return

    const formButton = document.getElementById(`envio${idSuffix}`)
    formButton.setAttribute('disabled', true)

    const inputs = document.querySelectorAll('input')

    inputs.forEach((input) => {

        input.addEventListener('change', (e) => {
            console.log(e.target.value.trim())
        })

        input.addEventListener('blur', (e) => {
            const inputName = e.target.name

            console.log(inputName)

            switch (inputName) {
                case 'email': booleanValidation = valEmail(idSuffix, e.target.value)
                    break
                case 'telefono': booleanValidation = valTelefono(idSuffix, e.target.value)
                    break
                case 'nombre': booleanValidation = valNombre(idSuffix, e.target.value)
                    break
                case 'lada': booleanValidation = valLada(idSuffix, e.target.value)
                    break
                case 'capacidad': booleanValidation = valGeneral(`capacidadHelp${idSuffix}`, e.target.value)
                    break
            }
        })
    })

    const selects = document.querySelectorAll('select')
    selects.forEach((select) => {
        select.addEventListener('blur', (e) => {
            const value = e.target.value
            const selectId = e.target.id // ID único para cada select
            console.log(e.target.id)
            const helpId = `${selectId}Help${idSuffix}`

            if (!value) {
                toggleError(helpId, false)
            } else {
                toggleError(helpId, true)
            }
        })
    })


    form.addEventListener('submit', (e) => {
        e.preventDefault()
        const data = Object.fromEntries(new FormData(e.target))

        const finalData = {
            ...data,
            ...extraData(data),
            numeroConcat: (`}${data.lada}${data.telefono}`),
            url: location.href,
        }

        if (isEmailValid && isNumberValid && isEmailValid) {
            formButton.removeAttribute('disabled')
        }

        console.log(finalData)
    })
}


handleForm('cotizacionForm', (data) => ({
}), 'cotizacion', 'Cotizacion')


//Validaciones

function valEmail(idSuffix, email) {
    const regularExprEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    isEmailValid = regularExprEmail.test(email)

    toggleError(`emailHelp${idSuffix}`, isEmailValid)

    return isEmailValid
}

function valTelefono(idSuffix, number) {
    isNumberValid = number.length == 7
    toggleError(`telefonoHelp${idSuffix}`, isNumberValid)

    return isNumberValid
}

function valNombre(idSuffix, nombre) {
    const contieneNumero = /\d/.test(nombre) || !nombre;
    isNombreValido = !contieneNumero;

    toggleError(`nombreHelp${idSuffix}`, isNombreValido);

    return isNombreValido;
}

function valLada(idSuffix, lada) {
    isLadaValid = lada.length == 3
    toggleError(`ladaHelp${idSuffix}`, isLadaValid)
}

function valGeneral(id, general) {
    if (!general) {
        toggleError(id, general)
    }
}