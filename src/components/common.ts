/**
 * 获取长度等大小的字符串形式，单位默认为px
 * @param value 值
 */
export function getSizeString(value: number | string): string {
    try {
        return parseInt(value.toString()) + "px";
    } catch {
        return value.toString();
    }
}