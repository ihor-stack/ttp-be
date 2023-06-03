// Loads environment variables from a .env file into process.env
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import versionRouter from './src/routes/version';
import healthCheckRouter from './src/routes/health';
import eventRouter from './src/routes/event';
//const authRouter = require('./src/routes/auth');
import authRouter from './src/routes/auth';

const app = express();
const port: number = parseInt(<string>process.env.PORT, 10) || 8081;

const corsOptions = {
  origin: process.env.CORS,
  //   optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));

app.use(express.json({ limit: '4mb' }));
app.use(express.urlencoded({ extended: false }));

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
  next();
});

app.use('/version', versionRouter);
app.use('/health-check', healthCheckRouter);
app.use('/event', eventRouter);
app.use('/auth', authRouter);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`CORS-enabled server running at http://localhost:${port}/`);
});

module.exports = app;
