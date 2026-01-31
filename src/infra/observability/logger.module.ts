import { Module } from "@nestjs/common";
import { LoggerModule } from 'nestjs-pino';

const nodeEnv = process.env.NODE_ENV;
const isDevelopmentEnv = nodeEnv === 'development';

@Module({
    imports : [
        LoggerModule.forRoot({
            pinoHttp : {
                level : 'info',
                ...(isDevelopmentEnv && {
                    transport : {
                        target : 'pino-pretty',
                        options : {
                            colorize : true,
                            translateTime : 'SYS:HH:MM:ss,sss',
                        }
                    }
                })
            }
        })
    ]
})
export class AppLoggerModule{}