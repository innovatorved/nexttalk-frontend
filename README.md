# NextTalk Frontend

NextTalk is a real-time chat application that supports both individual and group chats. This is the frontend codebase of the application built using Next.js and Prisma ORM. The database used is MongoDB.

Note : This is the frontend codebase of the application. The backend codebase can be found [here](https://github.com/innovatorved/nexttalk-backend.git) .

## Installation

To run the application locally, follow these steps:

1. Clone the repository: 

```bash
    git clone https://github.com/innovatorved/nexttalk-backend.git
```
2. Install the dependencies:

```bash
    cd nexttalk-frontend
    npm install
```
3. Set up the environment variables:

```bash
    cp .env.example .env.local
```
4. Set up Prisma Configuration

```bash
    npx prisma generate
```
5. Start the serve :

For Development server change the `NODE_ENV` variable in `.env.local` to `development` and run the following command:

```bash
    npm run dev
```
For Production server change the `NODE_ENV` variable in `.env.local` to `production` and run the following commands: 

```bash
    npm run build
    npm run start
```
6. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


Note : Make sure to replace the values in `.env.local` with your own values.

## Features

- Real-time individual chat
- Real-time group chat
- User authentication and authorization
- Ability to create, join and leave chat groups
- View list of online and offline users
- Search for users and chat groups
- Responsive design

## Tech Stack

Next.js, Prisma ORM, MongoDB, GraphQl, Apollo Client, React, ChakraUI, Nodejs

## Contributing

Contributions are welcome! Feel free to create a pull request or raise an issue. Please read the [contributing guidelines](https://github.com/innovatorved/nexttalk-frontend/blob/main/CONTRIBUTING.md) before contributing.

## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/innovatorved/nexttalk-frontend/blob/main/LICENSE) file for details.


## Authors

- [Ved Gupta](https://www.github.com/innovatorved)

## 🚀 About Me

I'm a Developer i will feel the code then write .

## Support

For support, email vedgupta@protonmail.com
