/**
 * 获取长度等大小的字符串形式，单位默认为px
 * @param value 值
 */
export function getSizeString(value: number | string): string {
    try {
        if (/^\d+$/.test(value.toString())) {
            return parseInt(value.toString()) + "px";
        }
    } catch {
        // TODO: 
    }
    return value.toString();
}