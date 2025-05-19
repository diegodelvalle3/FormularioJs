document.addEventListener("DOMContentLoaded", function () {

    let booleanValidation
    let isEmailValid
    let isLadaValid
    let isNombreValido
    let isNumberValid

    const validationState = {
        email: false,
        telefono: false,
        nombre: false,
        lada: false,
        capacidad: false,
        normaHelpModelos: false,
        unidadesHelpModelos: false
    }


    function handleForm(formId, extraData, idModal, idSuffix) {
        const form = document.getElementById(formId)
        if (!form) return

        console.log(form)

        const formButton = document.getElementById(`envio${idSuffix}`)
        formButton.setAttribute('disabled', true)

        const inputs = document.querySelectorAll('input')

        inputs.forEach((input) => {

            input.addEventListener('change', (e) => {
                console.log(e.target.value.trim())
            })

            let isValid = false

            input.addEventListener('blur', (e) => {
                const inputName = e.target.name

                console.log(inputName)

                switch (inputName) {
                    case 'email': isValid = valEmail(idSuffix, e.target.value)
                        validationState.email = isValid
                        break
                    case 'telefono': isValid = valTelefono(idSuffix, e.target.value)
                        validationState.telefono = isValid
                        break
                    case 'nombre': isValid = valNombre(idSuffix, e.target.value)
                        validationState.nombre = isValid
                        break
                    case 'lada': isValid = valLada(idSuffix, e.target.value)
                        validationState.lada = isValid
                        break
                    case 'capacidad': isValid = valGeneral(`capacidadHelp${idSuffix}`, e.target.value)
                        validationState.capacidad = isValid
                        break
                }

                checkAllValidations()
            })
        })

        const selects = document.querySelectorAll('select')
        selects.forEach((select) => {
            select.addEventListener('blur', (e) => {
                const value = e.target.value
                console.log(value)
                const selectId = e.target.id // ID único para cada select
                console.log(e.target.id)
                const helpId = `${selectId}Help${idSuffix}`

                if (value == 0) {
                    toggleError(helpId, false)
                    validationState[selectId] = false
                } else {
                    toggleError(helpId, true)
                    validationState[selectId] = true
                }

                checkAllValidations()
            })
        })

        function checkAllValidations() {
            const allValid = Object.values(validationState).every(Boolean)
            const formButton = document.getElementById(`envio${idSuffix}`)
            formButton.disabled = !allValid
        }

        form.addEventListener('submit', (e) => {
            e.preventDefault()
            const data = Object.fromEntries(new FormData(e.target))

            const finalData = {
                ...data,
                ...extraData(data),
                numeroConcat: (`}${data.lada}${data.telefono}`),
                url: location.href,
            }

            console.log(finalData)
        })
    }


    handleForm('cotizacionForm', (data) => ({
    }), 'cotizacion', 'Cotizacion')

    handleForm('modelos', (data) => ({
    }), null, 'Modelos')


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
        const contieneNumero = /\d/.test(nombre) || !nombre
        isNombreValido = !contieneNumero

        toggleError(`nombreHelp${idSuffix}`, isNombreValido)

        return isNombreValido
    }

    function valLada(idSuffix, lada) {
        isLadaValid = lada.length == 3
        toggleError(`ladaHelp${idSuffix}`, isLadaValid)

        return isLadaValid
    }

    function valGeneral(id, general) {
        general ? toggleError(id, true) : toggleError(id, false)
        return general
    }

    function toggleError(id, isValid) {
        const helpElement = document.getElementById(id)
        if (isValid) {
            hideElement(helpElement)
        } else {
            showElement(helpElement)
        }
    }

    function hideElement(el) {
        el.classList.add('hidden')
        setTimeout(() => {
            el.style.display = 'none'
        }, 50)
    }

    function showElement(el, display = 'block') {
        el.style.display = display
        setTimeout(() => {
            el.classList.remove('hidden')
        }, 50)
    }
})