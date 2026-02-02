import { Module } from "@nestjs/common";
import { LoggerModule } from 'nestjs-pino';

const nodeEnv = process.env.NODE_ENV || 'development';
const isProduction = nodeEnv === 'production';

@Module({
    imports : [
        LoggerModule.forRoot({
            pinoHttp : {
                level : 'info',
                ...(!isProduction && {
                    transport : {
                        target : 'pino-pretty',
                        options : {
                            colorize : true,
                            translateTime : 'SYS:HH:MM:ss,sss',
                            ignore : 'pid,hostname',
                        }
                    }
                })
            }
        })
    ]
})
export class AppLoggerModule{}