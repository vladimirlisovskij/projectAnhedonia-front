const App = {
    data() {
        return {
            IsaDay: true,
            loginModalOpen: false,
            registerModalOpen: false,

            passwordDoNotMatch: false,
            loginOrPasswordIncorrect: false,

            authLogin: "",
            authPassword: "",
            registerLogin: "",
            registerPassword: "",
            registerRePassword: "",
          
            firstThree: true,

            isLoggedIn: false
        }
    },
    mounted() {
         // Обработать тему
        let value = Cookies.get('IsaDay');
        if (value == undefined) {
            Cookies.set('IsaDay', 'true');
            value = 'true';
        }
        
        this.IsaDay = value == 'true';

        // Обработать логин
        let token = Cookies.get('token'); 
        if (token != undefined)
        {
            this.isLoggedIn = true;
        }
    },
    methods: {
        switchThree() {
            this.firstThree = !this.firstThree; 
        },
        getModeCssFile() {
            return this.IsaDay ? "lightMode.css" : "nightMode.css";
        },
        onModeChange() {
            Cookies.set('IsaDay', this.IsaDay.toString());
        },
        openLoginModal() {
            this.loginModalOpen = true;
            this.registerModalOpen = false;
        },
        openRegisterModal() {
            this.loginModalOpen = false;
            this.registerModalOpen = true;
        },
        closeModals() {
            this.loginModalOpen = false;
            this.registerModalOpen = false;

            this.authLogin = this.authPassword = this.registerLogin 
                = this.registerPassword = this.registerRePassword = "";

            this.loginOrPasswordIncorrect = this.passwordDoNotMatch = false;
        },

        login() {
            this.authLogin = this.authLogin.trim();
            this.authPassword = this.authPassword.trim();

            if (this.authLogin == "") return;
            if (this.authPassword == "") return;

            console.log(this.authLogin, this.authPassword);
            sendJSON("https://localhost:5001/Main/auth", { username: this.authLogin, password: this.authPassword }, (response) => 
            {
                if (response.status == 'error')
                {
                    this.loginOrPasswordIncorrect = true;
                }
                else 
                {
                    Toast.fire({
                        icon: 'success',
                        title: 'Успешно!'
                    });
                    Cookies.set('token', response.data);
                    this.isLoggedIn = true;
                    this.closeModals();
                }
            });
        },
        register()
        {
            this.registerLogin = this.registerLogin.trim();
            this.registerPassword = this.registerPassword.trim();
            this.registerRePassword = this.registerRePassword.trim();

            if (this.registerLogin == "") return;
            if (this.registerPassword == "") return;

            if (this.registerPassword != this.registerRePassword)
            {
                this.passwordDoNotMatch = true;
                return;
            }

            sendJSON("https://localhost:5001/Main/createUser", { username: this.registerLogin, password: this.registerPassword }, (response) => 
            {
                if (response.status == 'error')
                {
                    this.loginOrPasswordIncorrect = true;
                }
                else 
                {
                    Toast.fire({
                        icon: 'success',
                        title: 'Пользователь зарегистрирован!'
                    });
                    let login = this.registerLogin;
                    this.openLoginModal();
                    this.authLogin = login;
                }
            });
        }
    }
}

Vue.createApp(App).mount('body');