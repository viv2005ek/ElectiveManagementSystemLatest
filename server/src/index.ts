import express, {Request, Response} from 'express'
import dotenv from 'dotenv'
import AdminRoute from './routes/AdminRoute';
import AuthRoute from './routes/AuthRoute';
import cors from 'cors'
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import StudentRoute from './routes/StudentRoute';
import MinorSpecializationRoute from './routes/MinorSpecializationRoute';
import DepartmentRoute from './routes/DepartmentRoute';
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
app.use('/admin', AdminRoute)
app.use('/students', StudentRoute)
app.use('/minor-specializations', MinorSpecializationRoute)
app.use('/departments', DepartmentRoute)


app.get('/health-check', async (req: Request, res: Response) => {
  res.status(200).json({ msg: 'Server is online.' });
});


app.listen( port, () => {
  console.log("Server listening on port", port );
})


