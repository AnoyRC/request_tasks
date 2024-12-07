# Request Tasks

Get Paid for completing tasks

![Made-With-Request](https://img.shields.io/badge/Made%20with-RequestNetwork-00ff0dd.svg?colorA=222222&style=for-the-badge&logoWidth=14)
![Made-With-Next](https://img.shields.io/badge/MADE%20WITH-NEXT-000000.svg?colorA=222222&style=for-the-badge&logoWidth=14&logo=nextdotjs)
![Made-With-Tailwind](https://img.shields.io/badge/MADE%20WITH-TAILWIND-06B6D4.svg?colorA=222222&style=for-the-badge&logoWidth=14&logo=tailwindcss)
![Made-With-Javascript](https://img.shields.io/badge/MADE%20WITH-Javascript-ffd000.svg?colorA=222222&style=for-the-badge&logoWidth=14&logo=javascript)
![Made-With-NodeJS](https://img.shields.io/badge/MADE%20WITH-NodeJS-32a852.svg?colorA=222222&style=for-the-badge&logoWidth=14&logo=nodejs)
![Made-With-Express](https://img.shields.io/badge/MADE%20WITH-Express-000000.svg?colorA=222222&style=for-the-badge&logoWidth=14&logo=express)
![Made-With-ETHERS](https://img.shields.io/badge/MADE%20WITH-Ethers-000000.svg?colorA=222222&style=for-the-badge&logoWidth=14&logo=ethereum)

> Request Tasks is a dynamic kanban board platform designed to streamline task management and bounty fulfillment. The platform allows users to create tasks, claim available bounties, and receive payment upon successful completion through Request Network.

## Getting Started

### Frontend

1. Clone the repository

```bash
   git clone https://github.com/AnoyRC/request_tasks.git
   cd request-tasks
```

2. Open the frontend directory

```bash
   cd frontend
```

3. Install dependencies (forcing installation for Next.js @15.0.3)

```bash
   npm install --force
```

4. Copy the `.env.example` file to `.env.local` and fill in the required environment variables

```bash
   cp .env.example .env.local
```

5. Start the development server

```bash
   npm run dev
```

### Backend

1. Open the backend directory

```bash
   cd backend
```

2. Install dependencies

```bash
   npm install
```

3. Copy the `.env.example` file to `.env` and fill in the required environment variables

```bash
   cp .env.example .env
```

> Note: The backend requires a Convex Cloud URL to be set in the `.env` file. You can sign up for a free account at [Convex](https://convex.dev/)

4. Start the backend server

```bash
   npm run start
```

## Contributing

1. Fork the repository
2. Create your feature branch (git checkout -b feature/AmazingFeature)
3. Commit your changes (git commit -m 'Add some AmazingFeature')
4. Push to the branch (git push origin feature/AmazingFeature)
5. Open a Pull Request

## License

Distributed under the MIT License. See LICENSE for more information.
