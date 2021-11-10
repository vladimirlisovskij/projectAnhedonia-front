const App = {
    data() {
        return {
            selectedType: 0,

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

            isLoggedIn: false,

            articles: []
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

        // Получить все статьи
        sendJSON("https://localhost:5001/Test/allPosts", { }, (response) => 
        {
            response.data.forEach((article, id) => 
            {
                sendJSON(`https://localhost:5001/Main/getUser?id=${article.authorId}`, { }, (userResponse) =>
                {
                    let authorData = userResponse.data;

                    let cutContent = article.content.length > 500 ? article.content.substring(0, 500) + "..." : article.content;

                    let imageUrl = "";
                    if (article.title == "Тестовая статья №1")
                        imageUrl = "img/testArticle.png";
                    else
                        imageUrl = "img/logo.png";

                    this.articles.push({ title: article.title, date: new Date(article.creationDateTime), 
                        authorName: authorData.username, content: cutContent, image: imageUrl, articleUrl: `/post.html?id=${id+1}` });
                });
            });
        });
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
        b(n) {
            return n < 10 ? "0" + n : n; 
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