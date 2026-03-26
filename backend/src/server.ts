import cors from 'cors';
import 'dotenv/config';
import express, { NextFunction, Request, Response } from 'express';
import { router } from './routes';

const app = express();
app.use(express.json());
app.use(cors());
app.use(router);

app.use((error: Error, _request: Request, res: Response, _next: NextFunction) => {
    if (error instanceof Error) {
        return res.status(400).json({
            message: error.message
        })
    }

    return res.status(500).json({ error: "Internal server error" })
})

const PORT = process.env.PORT! || 3333;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})
