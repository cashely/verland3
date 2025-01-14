import dayjs from "dayjs";
import { produce, Immutable } from 'immer';
import { nanoid } from 'nanoid';
import type { ZodSchema } from 'zod';

export function formatDate(date: Date | string | number): (timeMate: string) => string {
      return (timeMate) => {

            if (!timeMate) return "";
            return dayjs(date).format(timeMate);
      }
}

export function editArray<T>(data: T[], callback: (item: Immutable<T[]>) => void): T[] {
      return produce(data, (draft: Immutable<T[]>) => {
            callback(draft);
      });
}

export function getId(): string {
      return nanoid();
}

/**
 * @name 从本地存储中获取token
 */
export function getTokenFromLocalStorage(): string | undefined {
      return localStorage.getItem("token") || undefined;
}

/**
 * @name 写入token到本地存储
 */
export function setTokenToLocalStorage(token: string | undefined): void {
      if (!token) {
            return;
      }
      localStorage.setItem("token", token);
}

/**
 * @name 从本地存储中移除token
 */
export function removeTokenFromLocalStorage(): void {
      localStorage.removeItem("token");
}
/**
 * @name 设置本地语言
 */
export function setLocaleToLocalStorage(locale: string): void {
      localStorage.setItem("locale", locale) || 'zh';
}

/**
 * @name 获取本地语言
 */
export function getLocaleToLocalStorage(): string | null {
      return localStorage.getItem("locale");
}

/**
 * @name 导出document
 */
export function exportDocument(data: any) {
      const file = new File([data.schema.content], `${data.name}.json`, { type: 'json' });
      const url = URL.createObjectURL(file);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${data.name}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
}

/**
 * @name antd form表单结合zod验证
 */
export function formFieldValidator<T>(scehma: ZodSchema<any>, errorMessage?: string): () => { validator: (rule: any, value: T) => Promise<void> } {
      //返回一个验证器返回promise
      return () => {
            return {
                  validator(_: unknown, value: T) {
                        const result: any = scehma.safeParse(value);
                        if (result.success) {
                              return Promise.resolve();
                        } else {
                              return Promise.reject(errorMessage || result.error.issues[0]);
                        }
                  }
            }
      }
}
