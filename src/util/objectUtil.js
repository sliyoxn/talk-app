export function deepFreeze(obj) {
    if (obj instanceof Object){
        Object.freeze(obj);
    }
    let keys = Object.keys(obj);
    for (let i = 0; i < keys.length; i++) {
        if (obj[keys[i]] instanceof Object && !Object.isFrozen(obj[keys[i]])){
            deepFreeze(obj[keys[i]]);
        }
    }
}