/* eslint-disable func-names */

import { NestFastifyApplication } from '@nestjs/platform-fastify';

import { Configure } from './configure';
/**
 * 应用核心类
 * 用于构建应用和配置实例
 */
export class App {
    /**
     * 配置对象
     */
    protected static _configure: Configure;

    /**
     * 应用实例
     */
    protected static _app: NestFastifyApplication;

    static get configure() {
        return this._configure;
    }

    static get app() {
        return this._app;
    }
}
