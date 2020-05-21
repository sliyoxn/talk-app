import BMF from "browser-md5-file";
const md5Util = new BMF();
export function computedMd5(fileData) {
    return new Promise(((resolve, reject) => {
        md5Util.md5(fileData, (err, md5) => {
            if (err){
                reject(err);
            } else {
                resolve(md5);
            }

        })
    }));
}



