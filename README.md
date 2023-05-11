## Run Locally

Clone the project

```bash
  git clone git@github.com:GymSquad/integrate-database.git
```

Go to the project directory

```bash
  cd integrate-database
```

Install dependencies

```bash
  pnpm install
```

Set environment variables in `.env` file in `/mysql` and `/postgres` (`mysql` is the old database)

```bash
  cp .env.example .env
```

Start the server

```bash
  cd ./postgres
  pnpm dev
```

Open another terminal and enter `/mysql`, then run the integrate script

```bash
  cd mysql
  pnpm start
```

Hit the API to write logs

```bash
  curl http://localhost:3000/website
```

When all the tasks are done, you will find `/postgres/id-mapping.json`, and you can run the move script to move the archive files

```bash
  cd tools
  pnpm move <path-to-your-json>
```
