const App = {
    data() {
        return {
            IsaDay: true,
            firstThree: true
        }
    },
    methods: {
        switchThree() {
            this.firstThree = !this.firstThree; 
        }
    }
}

Vue.createApp(App).mount('body');