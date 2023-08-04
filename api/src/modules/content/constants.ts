/**
 * 文章内容类型
 *
 * @export
 * @enum {number}
 */
export enum ReportBodyType {
    HTML = 'html',
    MD = 'markdown',
}

/**
 * 文章排序类型
 */
export enum ReportOrderType {
    CREATED = 'createdAt',
    UPDATED = 'updatedAt',
    PUBLISHED = 'publishedAt',
    COMMENTCOUNT = 'commentCount',
    CUSTOM = 'custom',
}
