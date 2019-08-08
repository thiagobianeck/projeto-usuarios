class UserController {

    constructor(formSearch, inputUser) {

        this.formSearch = document.getElementById(formSearch);
        this.inputUserGithub = document.getElementById(inputUser);
        this.onSubmit();
        this.onEdit();
    }

    onEdit() {
        document.querySelector('#box-user-update .btn-cancel')
            .addEventListener('click', e => {
                this.showPanelCreate();
            });

    }

    onSubmit() {

        this.formSearch.addEventListener('submit', event => {
            event.preventDefault();
            this.getValues(this.formSearch).then(result => {
                this.showCardUser();
                this.prencheCard(result);
            });

            this.preencheDataTable();



        });

    }

    prencheCard(dados){
        document.querySelector('#card-nome').innerHTML = dados.nome;
        document.querySelector('#card-bio').innerHTML = dados.bio;
        document.querySelector('#card-seguidores').innerHTML = dados.nro_seguidores;
        document.querySelector('#card-seguindo').innerHTML = dados.nro_seguindo;
        document.querySelector('#card-img').src = dados.imagem_url;
        document.querySelector('#span-repos').innerHTML = dados.repositorios;
    }

    preencheDataTable() {
        let dados;
        this.getRepositories().then(result => {
            dados = result;
        }).finally(() => {
            let table = $('#tbl-repositorios').DataTable();
            table.destroy();
            this.showDataTable();

            table = $('#tbl-repositorios').DataTable({
                data: dados,
                columns: [
                    {data: 'name',
                        render: function(data, type, full, meta) {
                            console.log({data, type, full, meta});
                            let titulo = `${data}`.toUpperCase();
                            return `<a href="${full.url}" target="_blank">${titulo}</a>`;
                        }},
                    {data: 'description'},
                    // {data: 'language'},
                    {data: 'language',
                        class: 'text-center',
                        render: function(data, type, full, meta) {
                            if(data){
                                let lang = '';
                                switch (`${data}`.toLowerCase()) {
                                    case 'java':
                                        lang = 'fa-java';
                                        break;
                                    case 'html':
                                        lang = 'fa-html5';
                                        break;
                                    case 'javascript':
                                        lang = 'fa-js';
                                        break;
                                    case 'php':
                                        lang = 'fa-php';
                                        break;
                                    case 'python':
                                        lang = 'fa-python';
                                        break;
                                    default:
                                        lang = '';
                                }
                                if(lang) {
                                    return `<span style="font-size: 30px"><i class="fab ${lang}"></i></span>`;
                                }
                                return `${data}`.toUpperCase();
                            }
                            return '';
                        }},
                    {data: 'stars', class: 'text-center'},
                ]
                // 'paging': true,
                // 'lengthChange': false,
                // 'searching': false,
                // 'ordering': true,
                // 'info': true,
                // 'autoWidth': false
            });
        });



    }

    criaEstrelas(numeroEstrelas) {

        let retorno = '';
        let star = '<i class="fa fa-star"></i>'
    }


    async getValues(formSearch) {

        let user = {};
        let isValid = true;

        let username = this.inputUserGithub.value;

        if(!username){
            this.inputUserGithub.parentElement.classList.add('has-error');
            isValid = false;
        } else {
            this.inputUserGithub.parentElement.classList.remove('has-error');
            let url = `https://api.github.com/users/${username}`;
            let result = await Fetch.get(url);

            if(result.name) {
                Object.assign(user, {
                    nome: result.name,
                    imagem_url: result.avatar_url,
                    bio: result.bio,
                    nro_seguidores: result.followers,
                    nro_seguindo: result.following,
                    repositorios: result.public_repos
                });
            }

        }

        if(!isValid){
            return false;
        }

        return user;
    }

    async getRepositories() {
        let repositories = [];
        let username = this.inputUserGithub.value;
        let url = `https://api.github.com/users/${username}/repos`;
        let result = await Fetch.get(url);
        result.forEach(repositorio => {

            let objRepo = {
                name: repositorio.name,
                description: repositorio.description,
                language: repositorio.language,
                stars: repositorio.stargazers_count,
                url: repositorio.html_url
            };
           repositories.push(objRepo);
        });

        return repositories;
    }

    addLine(dataUser) {

    }

    addEventsTr(tr) {


    }

    showCardUser(){
        document.querySelector('#card-user').style.display = 'block';
    }

    showDataTable(){
        document.querySelector('#data-repos').style.display = 'block';
    }


    updateCount() {

        let numberUsers = 0;
        let numberAdmin = 0;

        [...this.tableEl.children].forEach(tr => {
            numberUsers++;
            let user = JSON.parse(tr.dataset.user);
            if(user._admin) numberAdmin++;
        });

        document.querySelector('#number-users').innerHTML = numberUsers;
        document.querySelector('#number-users-admin').innerHTML = numberAdmin;
    }

}
