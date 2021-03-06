import * as dotenv from 'dotenv';
dotenv.config();

import express from 'express'
import * as http from 'http'
import * as bodyparser from 'body-parser'
import * as winston from 'winston'
import * as expressWinston from 'express-winston'
import cors from 'cors'
import CommonRoutesConfig from './api/route/common.routes.config'
import UnprotectedUserRoutes from './api/route/unprotected.user.routes'
import UserRoutes from './api/route/user.routes'
import debug from 'debug'
import tokenGuard from './api/middleware/token-guard'
import QuestionRoutes from './api/route/question.routes'
import AnswerRoutes from './api/route/answer.routes'
import apicache from 'apicache'
import VoteRoutes from './api/route/vote.routes'
import SubscriptionRoutes from './api/route/subscription.routes'


const app: express.Application = express();
const server: http.Server = http.createServer(app);
const port: Number = 3000;
const routes: Array<CommonRoutesConfig> = [];
const debugLog: debug.IDebugger = debug('app');
let cache = apicache.middleware

// here we are adding middleware to parse all incoming requests as JSON 
app.use(bodyparser.json());

// here we are adding middleware to allow cross-origin requests
app.use(cors());

// here we are configuring the expressWinston logging middleware,
// which will automatically log all HTTP requests handled by Express.js
app.use(expressWinston.logger({
    transports: [
        new winston.transports.Console()
    ],
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.json()
    )
}));
// app.use(cache('5 minutes'))

// here we are adding the UserRoutes to our array,
// after sending the Express.js application object to have the routes added to our app!
routes.push(new UnprotectedUserRoutes(app));

// here we are configuring the expressWinston error-logging middleware,
// which doesn't *handle* errors per se, but does *log* them
app.use(expressWinston.errorLogger({
    transports: [
        new winston.transports.Console()
    ],
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.json()
    )
}));

// this is a simple route to make sure everything is working properly
app.get('/', (req: express.Request, res: express.Response) => {
    res.status(200).send({status: 'up'})
});


app.use(tokenGuard())
//...register protected router after injecting the token guard
routes.push(new UserRoutes(app))
routes.push(new QuestionRoutes(app))
routes.push(new AnswerRoutes(app))
routes.push(new VoteRoutes(app))
routes.push(new SubscriptionRoutes(app))

server.listen(port, () => {
    debugLog('Server running at http://localhost:${port}');
    routes.forEach((route: CommonRoutesConfig) => {
        debugLog('Routes configured for ${route.getName()}');
    });
});