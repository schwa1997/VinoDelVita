import { Type } from '@nestjs/common';

import dayjs from 'dayjs';
import { Ora } from 'ora';

/** ******************** 应用配置  ********************* */

/**
 * 应用配置
 */
export interface AppConfig {
    /**
     * 主机地址,默认为127.0.0.1
     */
    host: string;
    /**
     * 监听端口,默认3100
     */
    port: number;
    /**
     * 是否开启https,默认false
     */
    https: boolean;
    /**
     * 时区,默认Asia/Shanghai
     */
    timezone: string;
    /**
     * 语言,默认zh-cn
     */
    locale: string;
    /**
     * 控制台打印的url,默认自动生成
     */
    url?: string;
    /**
     * 由url+api前缀生成的基础api url
     */
    api?: string;
}

/** ******************** 应用创建  ********************* */
/**
 * 应用创建函数
 */

/**
 * 模块类型
 */
export type ModuleItem = Type<any> | ModuleOption;

/**
 * 为模块加一些额外的参数,可以在构造时获取
 */
export type ModuleOption = { module: Type<any>; params?: Record<string, any> };

/**
 * 模块构建器参数选项
 */

/** ******************** 配置系统  ********************* */

/**
 * 配置服务的yaml动态存储选项
 */
export interface ConfigStorageOption {
    /**
     * 是否开启动态存储
     */
    storage?: boolean;
    /**
     * yaml文件路径,默认为dist目录外的config.yaml
     */
    yamlPath?: string;
}

export type ConnectionOption<T extends Record<string, any>> = { name?: string } & T;
export type ConnectionRst<T extends Record<string, any>> = Array<{ name: string } & T>;

/** ****************************** CLI及命令  ***************************** */

/**
 * 命令集合
 */

/**
 * 命令构造器
 */
/**
 * 控制台错误函数panic的选项参数
 */
export interface PanicOption {
    /**
     * 报错消息
     */
    message: string;
    /**
     * ora对象
     */
    spinner?: Ora;
    /**
     * 抛出的异常信息
     */
    error?: any;
    /**
     * 是否退出进程
     */
    exit?: boolean;
}

/** ****************************** 时间  ***************************** */

/**
 * getTime函数获取时间的选项参数
 */
export interface TimeOptions {
    /**
     * 时间
     */
    date?: dayjs.ConfigType;
    /**
     * 输出格式
     */
    format?: dayjs.OptionType;
    /**
     * 语言
     */
    locale?: string;
    /**
     * 是否严格模式
     */
    strict?: boolean;
    /**
     * 时区
     */
    zonetime?: string;
}
