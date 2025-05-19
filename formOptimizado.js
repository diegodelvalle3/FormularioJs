document.addEventListener("DOMContentLoaded", function () {

    function handleForm(formId, extraData, idModal, idSuffix, requiredFields) {
        const form = document.getElementById(formId)
        if (!form) return

        const validationState = {}

        requiredFields.forEach(field => {
            validationState[field] = false
        })

        const formButton = document.getElementById(`envio${idSuffix}`)
        if (formButton) formButton.setAttribute('disabled', true)

        const inputs = form.querySelectorAll('input, textarea')
        const selects = form.querySelectorAll('select')

        inputs.forEach((input) => {
            input.addEventListener('blur', () => {
                const field = input.id.replace(idSuffix, '')
                const value = input.value
                let isValid = false

                switch (field) {
                    case 'email': isValid = validateEmail(value); break
                    case 'telefono': isValid = validateTelefono(value); break
                    case 'nombre': isValid = validateNombre(value); break
                    case 'lada': isValid = validateLada(value); break
                    case 'capacidad':
                    case 'asunto': isValid = validateGeneral(value); break
                    default: return
                }

                validationState[field] = isValid
                toggleError(`${field}Help${idSuffix}`, isValid)
                updateSubmitState(validationState, formButton)
            })
        })

        selects.forEach((select) => {
            select.addEventListener('blur', () => {
                const field = select.id
                const value = select.value
                const isValid = value !== "0"

                validationState[field] = isValid
                toggleError(`${field}Help${idSuffix}`, isValid)
                updateSubmitState(validationState, formButton)
            })
        })

        form.addEventListener('submit', (e) => {
            e.preventDefault()
            const formData = Object.fromEntries(new FormData(form))

            const finalData = {
                ...formData,
                ...extraData(formData),
                numeroConcat: `${formData.lada || ''}${formData.telefono || ''}`,
                url: location.href
            }

            console.log('Formulario enviado con:', finalData)
        })
    }

    // Utiliza esta función para validar que todo esté OK antes de habilitar el botón
    function updateSubmitState(validationState, button) {
        const allValid = Object.values(validationState).every(Boolean)
        if (allValid) {
            button.removeAttribute('disabled')
            console.log('Todas las validaciones son correctas')
        } else {
            button.setAttribute('disabled', true)
            console.log('Hay campos con errores')
        }
        console.log(validationState)
    }

    // Validaciones individuales
    const validateEmail = (email) =>
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)

    const validateTelefono = (telefono) => /^\d{7}$/.test(telefono)

    const validateLada = (lada) => /^\d{3}$/.test(lada)

    const validateNombre = (nombre) => !!nombre && !/\d/.test(nombre)

    const validateGeneral = (value) => !!value.trim()

    function toggleError(helpId, isValid) {
        const el = document.getElementById(helpId)
        if (!el) return

        if (isValid) {
            el.classList.add('hidden')
            setTimeout(() => { el.style.display = 'none' }, 50)
        } else {
            el.style.display = 'block'
            setTimeout(() => { el.classList.remove('hidden') }, 50)
        }
    }

    // Llama a handleForm con los formularios específicos
    handleForm('cotizacionForm', () => ({}), 'cotizacion', 'Cotizacion', ['nombre', 'email', 'lada', 'telefono', 'capacidad'])
    handleForm('modelos', () => ({}), null, 'Modelos', ['nombre', 'email', 'lada', 'telefono', 'capacidad', 'norma', 'unidades'])
    handleForm('contacto', () => ({}), null, 'Contacto', ['email', 'telefono', 'nombre', 'lada', 'asunto'])

})





// function codigoSinOptimizar() {
//     document.addEventListener("DOMContentLoaded", function () {

//         const validationState = {}
    
//         function handleForm(formId, extraData, idModal, idSuffix, requiredFields) {
//             const form = document.getElementById(formId)
//             if (!form) return
    
//             requiredFields.forEach((field) => {
//                 validationState[field] = false
//             })
    
//             const formButton = document.getElementById(`envio${idSuffix}`)
//             formButton.setAttribute('disabled', true)
    
//             const inputs = form.querySelectorAll('input')
    
//             inputs.forEach((input) => {
//                 let isValid = false
    
//                 input.addEventListener('blur', (e) => {
//                     const inputName = e.target.id
//                     switch (inputName) {
//                         case `email${idSuffix}`: isValid = valEmail(idSuffix, e.target.value)
//                             validationState.email = isValid
//                             break
//                         case `telefono${idSuffix}`: isValid = valTelefono(idSuffix, e.target.value)
//                             validationState.telefono = isValid
//                             break
//                         case `nombre${idSuffix}`: isValid = valNombre(idSuffix, e.target.value)
//                             validationState.nombre = isValid
//                             break
//                         case `lada${idSuffix}`: isValid = valLada(idSuffix, e.target.value)
//                             validationState.lada = isValid
//                             break
//                         case `capacidad${idSuffix}`: isValid = valGeneral(`capacidadHelp${idSuffix}`, e.target.value)
//                             validationState.capacidad = isValid
//                             break
//                         case `asunto${idSuffix}`: isValid = valGeneral(`asuntoHelp${idSuffix}`, e.target.value)
//                             validationState.asunto = isValid
//                             break
//                     }
//                     allValidations(formButton)
//                 })
//             })
    
//             const selects = form.querySelectorAll('select')
    
//             selects.forEach((select) => {
//                 select.addEventListener('blur', (e) => {
//                     const value = e.target.value
//                     const selectId = e.target.id
//                     const helpId = `${selectId}Help${idSuffix}`
    
//                     if (value === "0") {
//                         toggleError(helpId, false)
//                         validationState[selectId] = false
//                     } else {
//                         toggleError(helpId, true)
//                         validationState[selectId] = true
//                     }
    
//                     allValidations(formButton)
//                 })
//             })
    
    
    
//             form.addEventListener('submit', (e) => {
//                 e.preventDefault()
    
//                 const data = Object.fromEntries(new FormData(e.target))
    
//                 const finalData = {
//                     ...data,
//                     ...extraData(data),
//                     numeroConcat: (`${data.lada}${data.telefono}`),
//                     url: location.href,
//                 }
    
//                 console.log(finalData)
//             })
//         }
    
    
//         handleForm('cotizacionForm', (data) => ({
//         }), 'cotizacion', 'Cotizacion', ['nombre', 'email', 'lada', 'telefono', 'capacidad'])
    
//         handleForm('modelos', (data) => ({
//         }), null, 'Modelos', ['nombre', 'email', 'lada', 'telefono', 'capacidad', 'norma', 'unidades'])
    
//         handleForm('contacto', (data) => ({
//         }), null, 'Contacto', ['email', 'telefono', 'nombre', 'lada', 'asunto'])
    
    
//         function allValidations(formButton) {
//             const todosSonTrue = Object.values(validationState).every(valor => valor === true);
//             if (todosSonTrue) {
//                 formButton.removeAttribute('disabled');
//                 console.log('Todas las validaciones son correctas')
//                 validationState.values = false
//             } else {
//                 console.log('Validación(es) incorectas')
//                 formButton.setAttribute('disabled', true)
//             }
    
//             console.log(validationState)
//         }
    
    
//         //Validaciones
    
//         function valEmail(idSuffix, email) {
//             const regularExprEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
//             let isEmailValid = regularExprEmail.test(email)
    
//             toggleError(`emailHelp${idSuffix}`, isEmailValid)
    
//             return isEmailValid
//         }
    
//         function valTelefono(idSuffix, number) {
//             let isNumberValid = number.length == 7
//             toggleError(`telefonoHelp${idSuffix}`, isNumberValid)
    
//             return isNumberValid
//         }
    
//         function valNombre(idSuffix, nombre) {
//             const contieneNumero = /\d/.test(nombre) || !nombre
//             let isNombreValido = !contieneNumero
    
//             toggleError(`nombreHelp${idSuffix}`, isNombreValido)
    
//             return isNombreValido
//         }
    
//         function valLada(idSuffix, lada) {
//             let isLadaValid = lada.length == 3
//             toggleError(`ladaHelp${idSuffix}`, isLadaValid)
    
//             return isLadaValid
//         }
    
//         function valGeneral(id, general) {
//             const estaVacio = general ? true : false
//             toggleError(id, estaVacio)
//             return estaVacio
//         }
    
//         function toggleError(id, isValid) {
//             const helpElement = document.getElementById(id)
//             if (isValid) {
//                 hideElement(helpElement)
//             } else {
//                 showElement(helpElement)
//             }
//         }
    
//         function hideElement(el) {
//             el.classList.add('hidden')
//             setTimeout(() => {
//                 el.style.display = 'none'
//             }, 50)
//         }
    
//         function showElement(el) {
//             el.style.display = 'block'
//             setTimeout(() => {
//                 el.classList.remove('hidden')
//             }, 50)
//         }
//     })
// }
