<template>
    <v-container>
        <div class="body">
            <img
                src="../assets/datahow-logo.png"
                class="logo"
            />
            <v-autocomplete
                :items="countries"
                item-text="name"
                item-value='iso'
                label="Choose a country to view its data"
                v-model="selected_iso"
            ></v-autocomplete>

            <div v-if="selected_iso" class="div_graphs">
                <v-progress-circular
                    v-if="graph1_loading"
                    indeterminate
                    color="red"
                    class="loading_animation"
                >
                </v-progress-circular>
                <div v-else>
                    <line-chart
                        v-if="show_graphs_1"
                        :chart-data="data_graphs_1"
                    ></line-chart>

                    <BarChart
                        v-if="show_graphs_1"
                        :chart-data="data_graphs_1"
                        style="padding-top: 20%"
                    ></BarChart>
                </div>
            </div>
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
                data_graphs_1: {},
                show_graphs_1: false,
                graph1_loading: true,
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
                this.show_graphs_1 = false
                this.graph1_loading = true
                let color = this.getRandomColor()
                this.data_graphs_1 =
                {
                    labels: [],
                    datasets: [{
                        label: '# of new cases in selected country',
                        data: [],
                        fill: false,
                        backgroundColor: [color, this.getRandomColor(), this.getRandomColor()],
                        borderColor: color,
                    }]
                }

                for (let index = past_days_range; index>0; index--)
                {
                    try
                    {
                        let date = moment()
                        date = date.subtract(index, 'days').format("YYYY-MM-DD")
                        
                        this.data_graphs_1.labels.push(moment(date).format("DD/MM/YYYY"))

                        const result = await axios.get(`
                            /reports/total?date=${date}&iso=${iso}
                        `)
                        
                        this.data_graphs_1.datasets[0].data.push(result.data.data.confirmed_diff)
                    }
                    catch (error)
                    {
                        console.log("error!")
                        console.log(error)
                    }
                }
                this.show_graphs_1 = true
                this.graph1_loading = false
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
    .body {
        display: flex;
        flex-direction: column;
        max-width: 50%;
        margin:  10px auto;
    }

    .logo {
        width: 50%;
        display: flex;
        align-self: center;
        padding-bottom: 10%;
    }

    .div_graphs {
        width: 100%;
        display: flex;
        
        justify-content: center;
    }

    .loading_animation {
        padding-top: 20%;
        align-self: center;
    }
</style>
