import Axios from 'axios'

const axios = Axios.create({
    //baseURL: "",
})

/* axios.interceptors.response.use( //TODO: handle error requests here
    function (error)
    {}
    )
) */

export default axios
