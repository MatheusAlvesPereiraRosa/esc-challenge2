# Desafio 2 - API de autenticação (esc-challenge2)

Seja bem vindo ao meu projeto novamente. Essa é a parte dois do desafio da vaga de desenvolvedor Back-End a qual eu serei avaliado

## Descrição

O desafio era criar uma API com autenticação de usuários, que permita operações de cadastro (sign up), autenticação (sign in) e recuperação de informações do usuário.

Eu utilizei os pacotes de JWT (para geração de tokens de sessão e troca de senhas) e bcrypt (para hashear a senha do usuário ao criá-la e ao recebê-la para identificá-la ver se está correta). Para a persistência dos dados, utilizei o mongoDB Atlas para guardar os dados da aplicação em um documento chamado "users".
Também foi utilizado o eslint para estilizar e organizar o código seguindo boas práticas e organização com padrões MVC.

Segundo as descrições que foram dadas para as rotas de sign up, sign in e recuperação de informações de usuários, e seus respectivos tratamentos de respostas e erros, como pode ser testado abaixo pelos seguintes link:

Obs.: Recomendo a utilização do insomnia ou postman para realizar as requisições com os json e para visualizar as respostas. 

Link: https://insomnia.rest/download

### Sign up

https://esc-challenge2-bec0f34c4d2f.herokuapp.com/auth/register

Basta inserir as informações igual o mostrado abaixo e a rota irá mostrar as informações e o token necessário para logar, no caso de tudo ter dado certo.

formato de json:

```
  {
    "nome" : "#####",
    "email" : "#####",
    "senha" : "#####",
    "telefones" : [{"numero": "#########", "ddd":"##"}, {"numero" : "#########", "ddd": "##"}]
  }
```

### Sign in

https://esc-challenge2-bec0f34c4d2f.herokuapp.com/auth/login

Logue com suas informações e a rota irá oferecer a informações do login junto do token (caso esteja tudo certo).

formato de json:

```
  {
    "email" : "escribo@gmail.com",
    "senha" : "54231"
  }
```

### Users (informações dos usuários cadastrados)

Para entrar nessa rota, é necessário utilizar o token gerado ou na criação de usuário ou no login/sign in

Header necessário:

```
  Authorization: Bearer #########
```

### Bônus

#### ResetPassword

Rota para solicitar token para trocar senha. O token é criado a partir de JWT, juntando a informação do _id do usuário e uma chave secreta (no arquivo .env) ao token

json:

```
  {
    "nome" : "escribo",
    "email" : "escribo@gmail.com"
  }
```

#### ChangePassword

Com o token em mãos, basta mandá-lo junto da senha e ela será trocada

json:

```
  {
    "token" : "##################",
    "senha" : "#####"
  }
```

Obs.: Substitua os ### pela informação que será inserida na rota, assim como sugerem os nomes.

### Rodando aplicação localmente

Clone o repositório do github

```
  git clone git@github.com:MatheusAlvesPereiraRosa/esc-challenge2.git
```

Depois baixe as dependências

```
  npm i
```

Depois configure o seu arquivo .env com as seguintes informações

.env

```
DB_USER=#####
DB_PASS=#####
DB_NAME=#####
SECRET_KEY="######"
```

E por fim, rode-a com

```
  node index.js ou npm start ou nodemon index.js
```

