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
                countries_loading: true,
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
                this.countries_loading = true
                try
                {
                    const result = await axios.get("/regions")
                    this.countries = result.data.data
                    this.countries_loading = false
                    //TODO: handle empty data array -- false positive
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
