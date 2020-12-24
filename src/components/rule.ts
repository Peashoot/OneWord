export interface Rule {
    /**
     * 是否为必选字段
     */
    required?: boolean;
    /**
     * 错误提示文案
     */
    message?: string | ErrorConsturctor;
    /**
     * 通过函数进行校验
     */
    validator?: string | Validator;
    /**
     * 通过正则表达式进行校验
     */
    pattern?: RegExp;
    /**
     * 本项规则的触发时机，可选值为onChange、onBlur
     */
    trigger?: string;
    /**
     * 格式化函数，将表单项的值转换后进行校验
     */
    formatter?: TextFormatter;
}
export type ErrorConsturctor = (value: string, rule: Rule) => string;
export type Validator = (value: string, rule: Rule) => boolean | Promise<boolean>;
export type TextFormatter = (value: string, rule: Rule) => any;