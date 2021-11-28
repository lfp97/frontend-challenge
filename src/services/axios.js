import Axios from 'axios'
import Swal from 'sweetalert2'

const axios = Axios.create({
    //baseURL: "",
})

axios.interceptors.response.use(
    (config) => {return config},
    function (error)
    {
        if (error.response.status === 404)
            Swal.fire({
                title: 'Error',
                text: "Something is not working, try again later.",
                icon: 'warning',
                showCancelButton: false,
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'OK',
                allowEscapeKey: false,
                allowOutsideClick: false
            })
        return Promise.reject(error)
    }
)

export default axios
