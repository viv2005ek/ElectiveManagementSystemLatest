import express, {Request, Response} from 'express'
import dotenv from 'dotenv'
import adminRoute from './routes/AdminRoute';
import authRoute from './routes/AuthRoute';
import AuthRoute from './routes/AuthRoute';
import cors from 'cors'
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

dotenv.config()

const app  = express()

const port = process.env.PORT || 8080
app.use(cors({
  origin: '*'
}));


//middleware
app.use(express.json())
app.use(morgan('dev'))
app.use(cookieParser());


//routes
app.use('/auth', AuthRoute)
app.use('/admin', adminRoute)


app.get('/health-check', async (req: Request, res: Response) => {
  res.status(200).json({ msg: 'Server is online.' });
});


app.listen( port, () => {
  console.log("Server listening on port", port );
})


