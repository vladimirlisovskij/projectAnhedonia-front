const App = {
    data() {
        return {
            IsaDay: true,
            commentText: "",
            articleId: -1,
            author: {
                name: 'Загрузка...',
                date: new Date(),
                about: 'Загрузка...'
            },
            article: {
                title: 'Загрузка...',
                imageUrl: 'img/testArticle.png',
                date: new Date(),
                contentParagraphs: ['Загрузка...']
            },
            comments: []
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

        // Понять какую статью мы хотим прочитать
        let searchParams = new URLSearchParams(window.location.search);

        let id = searchParams.get('id');
        this.articleId = id;

        // Делаем запрос на бекенд с этим id
        sendJSON(`https://localhost:5001/Main/getArticle?id=${id}`, { }, (response) =>
        {
            let data = response.data;

            this.article.title = data.title;
            if (this.article.title == "Тестовая статья №1")
                this.article.imageUrl = "img/testArticle.png";
            else
                this.article.imageUrl = "img/logo.png";

            this.article.date = new Date(data.creationDateTime);
            
            this.article.contentParagraphs = data.content.split('\n');            

            // Достаём автора и получаем его данные
            let authorId = data.authorId;

            data.comments.forEach(commentId => 
            {
                sendJSON(`https://localhost:5001/Main/getComment?id=${commentId}`, { }, (commentResponse) =>
                {
                    sendJSON(`https://localhost:5001/Main/getUser?id=${commentResponse.data.authorId}`, { }, (authorResponse) =>
                    {
                        this.comments.push({ authorName: authorResponse.data.username, date: new Date(commentResponse.data.creationDateTime), content: commentResponse.data.content });
                    });
                });
            });

            sendJSON(`https://localhost:5001/Main/getUser?id=${authorId}`, { }, (response) =>
            {
                let authorData = response.data;

                this.author.name = authorData.username;
                this.author.data = authorData.registrationDate;
                this.author.about = authorData.about;
            });
        });
    },
    methods: { 
        getModeCssFile() {
            return this.IsaDay ? "lightMode.css" : "nightMode.css";
        },
        onModeChange() {
            Cookies.set('IsaDay', this.IsaDay.toString());
        },
        b(n) {
            return n < 10 ? "0" + n : n; 
        },
        sendComment() {
            if (this.commentText.trim() == "")
                return;

            sendJSONBearer("https://localhost:5001/Main/createSelfComment", { content: this.commentText, postId: Number(this.articleId) }, Cookies.get('token'), (response) => 
            {
                if (response.status != 'error') {
                    Toast.fire({
                        icon: 'success',
                        title: 'Комментарий оставлен!'
                    });

                    this.comments.push({ authorName: "Вы", date: new Date(), content: this.commentText });

                    this.commentText = "";
                }
            });
        }
    }
}

Vue.createApp(App).mount('body');