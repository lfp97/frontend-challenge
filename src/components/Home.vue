<template>
    <v-container>
        <v-autocomplete
            :items="countries"
            item-text="name"
            item-value='iso'
            label="Choose a country to view its data"
            v-model="selected_iso"
        ></v-autocomplete>
        <v-btn
            depressed
            color="primary"
            v-if="selected_iso"
        >
            Primary
        </v-btn>

    </v-container>
</template>


<script>
    import axios from '../services/axios'

    export default
    {
        data()
        {
            return {
                countries: [],
                selected_iso: "",
            }
        },
        name: 'Home',
        components: {},
        methods:
        {
            async getCountries()
            {
                try
                {
                    const result = await axios.get("/regions")
                    console.log("result:", result)
                    this.countries = result.data.data
                }
                catch (error)
                {
                    console.log("error!")
                    console.log(error)
                }
            },

            getNameFromIso(value)
            {
                const country = this.countries.find((i) => i.iso === value)
                return country? country.name : "Error"
            },
        },
        watch:
        {
            selected_iso(value)
            {
                if (value)
                    this.getReports(value)
            }
        },
        mounted()
        {
            this.getCountries()
        }
    }
</script>
