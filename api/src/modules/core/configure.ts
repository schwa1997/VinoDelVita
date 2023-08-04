import path from 'path';

import { has, isNil } from 'lodash';

import { EnvironmentType } from './constants';

import { ConfigStorageOption } from './types';

/**
 * 配置类
 */
export class Configure {
    /**
     * 配置是否被初始化
     */
    protected inited = false;

    /**
     * 配置构建函数对象
     */

    /**
     * 生成的配置
     */
    protected config: Record<string, any> = {};

    /**
     * 使用yaml存储的配置
     */
    protected ymlConfig: Record<string, any> = {};

    /**
     * 是否开启yaml配置存储功能
     */
    protected storage = false;

    /**
     * yaml配置路径
     */
    protected yamlPath = path.resolve(__dirname, '../../..', 'config.yml');

    /**
     * 根据选项初始化配置类
     * @param option
     */
    init(option: ConfigStorageOption = {}) {
        if (this.inited) return this;
        const { storage, yamlPath } = option;
        if (!isNil(storage)) this.storage = storage;
        if (!isNil(yamlPath)) this.yamlPath = yamlPath;
        this.inited = true;
        return this;
    }

    /**
     * 获取当前允许环境
     */
    getRunEnv(): EnvironmentType {
        return process.env.NODE_ENV as EnvironmentType;
    }

    /**
     * 获取所有配置
     */
    all() {
        return this.config;
    }

    /**
     * 判断配置是否存在
     * @param key
     */
    has(key: string) {
        return has(this.config, key);
    }

    /**
     * 设置配置项
     * @param key 配置名
     * @param value 配置值
     * @param storage 是否动态存储
     * @param append 如果为true,则如果已经存在的包含数组的配置,使用追加方式合并,否则直接替换
     */
}
