const App = {
    data() {
        return {
            IsaDay: true,
        }
    },
    methods: { 
        getModeCssFile() {
            return this.IsaDay ? "lightMode.css" : "nightMode.css";
        }
    }
}

Vue.createApp(App).mount('body');