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

        <div class="small">
            <line-chart
                v-if="show_graph_1"
                :chart-data="data_1"
            ></line-chart>

            <BarChart
                v-if="show_graph_1"
                :chart-data="data_1"
            ></BarChart>
        </div>
    </v-container>
</template>


<script>
    import axios from '../services/axios'
    import moment from 'moment'
    import BarChart from './graphs/BarChart'
    import LineChart  from './graphs/LineChart'

    export default
    {
        data()
        {
            return {
                countries_loading: true,
                countries: [],
                selected_iso: "",
                data_1: {},
                show_graph_1: false,
            }
        },

        name: 'Home',

        components:
        {
            BarChart,
            LineChart,
        },

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

            async getReports(iso, past_days_range = 3)
            {
                this.show_graph_1 = false
                let color = this.getRandomColor()
                this.data_1 =
                {
                    labels: [],
                    datasets: [{
                        label: '# of new cases for selected country',
                        data: [],
                        fill: false,
                        backgroundColor: [color, this.getRandomColor()],
                        borderColor: color,
                    }]
                }

                for (let index = past_days_range; index>0; index--)
                {
                    try
                    {
                        let date = moment()
                        date = date.subtract(index, 'days').format("YYYY-MM-DD")
                        
                        this.data_1.labels.push(moment(date).format("DD/MM/YYYY"))

                        const result = await axios.get(`
                            /reports/total?date=${date}&iso=${iso}
                        `)
                        
                        this.data_1.datasets[0].data.push(result.data.data.confirmed_diff)
                    }
                    catch (error)
                    {
                        console.log("error!")
                        console.log(error)
                    }
                }
                

                console.log(this.data_1)
                //TODO: handle empty data array -- false positive
                //TODO: adicionar flag de erro para nao setar true abaixo caso a flag de erro seja true
                this.show_graph_1 = true
            },

            getRandomColor()
            {
                var letters = '0123456789ABCDEF'
                var color = '#'

                for (var i = 0; i < 6; i++)
                    color += letters[Math.floor(Math.random() * 16)]

                return color
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


<style>
    .small {
        max-width: 600px;
        margin:  150px auto;
    }
</style>
