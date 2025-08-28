# ChatApp
## Sobre
Esse projeto se trata de um site de comunicação em tempo real entre usuarios, possuindo autenticação, capacidade de adicionar amigos, conversas privadas etc. O design foi bem inspirado no discord assim como a usabilidade.
## Como executar
### Docker
A forma principal de executar esse projeto é via docker compose, sendo apenas necessário clonar esse repositorio e no diretorio raiz executar:
```
sudo docker compose up --build
```
Após o build e as instancias ficarem disponiveis, o projeto ficará disponivel em:
https://localhost:4000/

## Tecnologias usadas:
- .NET 8
- ASP.NET
- C#
- RabbitMQ
- SignalR
- PostgreSQL
- Redis
- Nginx
- Docker
- Angular v20
- Angular Materials
- Typescript

## Imagens do projeto:
![HomePage](./FrontEnd/public/ProjetoFuncionando1.png)
![Solicitacao](./FrontEnd/public/Solicitacao.png)
![Envio De Mensagem](./FrontEnd/public/Mensagem%20enviada.png)
![Remocao e edicao de mensagens](./FrontEnd/public/Capacidade%20de%20editar%20e%20remover%20mensagens.png)
![Envio de outra pessoa](./FrontEnd/public/Outra%20pessoa%20enviando%20mensagem.png)