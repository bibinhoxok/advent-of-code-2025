import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

export const importText = (url: string) => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const text = fs.readFileSync(path.join(__dirname, url), "utf-8");

    return text
}

export const log = (...args: any[]) => {
    args.forEach(arg => {
        if (typeof arg === 'function') {
            const result = arg();
            let label = arg.toString();
            if (label.startsWith("() =>")) {
                label = label.replace("() =>", "").trim();
            } else if (label.startsWith("()=>")) {
                label = label.replace("()=>", "").trim();
            }
            console.log(`${label}:`);
            console.log( result);
        } else if (typeof arg === 'object' && arg !== null && !Array.isArray(arg)) {
            Object.entries(arg).forEach(([key, value]) => {
                console.log(`${key}:`);
                console.log(value);
            });
        } else {
            console.log(arg);
        }
    });
}
