import {ref, computed} from 'vue'
import axios from 'axios'



export default function useClima() {
    const clima = ref({})
    const cargando = ref(false)
    const error = ref('')

    const obtenerClima = async ({ ciudad, pais }) => {


        // importar el API Key
        const key = import.meta.env.VITE_API_KEY
        clima.value = {}
        cargando.value = true
        error.value = ''


        // obtener la lat, lon
        try {
            const url = `http://api.openweathermap.org/geo/1.0/direct?q=${ciudad},${pais}&limit=1&appid=${key}`
            const {data} = await axios(url)

            const { lat , lon } = data[0]

            const urlClima = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}`
            const {data : resultado} = await axios(urlClima)

            clima.value = resultado

        } catch {
            error.value = 'No se pudo obtener la información'
        }finally{
            cargando.value = false
        }

    }

    const formatearTemp = temperatura => parseInt(temperatura - 273.15)

    const mostrarClima = computed(() => {
        return Object.values(clima.value).length > 0
    })

    return {
        obtenerClima, 
        clima, 
        mostrarClima,
        formatearTemp,
        error, 
        cargando
    }
}