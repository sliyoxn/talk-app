export function allTrue(...args) {
    for (let i = 0; i < args.length; i++) {
        if (!args[i]){
            return false;
        }
    }
    return true;
}

export function allFalse(...args) {
    for (let i = 0; i < args.length; i++) {
        if (args[i]){
            return false;
        }
    }
    return true;
}


export function hasTrue(...args) {
    for (let i = 0; i < args.length; i++) {
        if (args[i]){
            return true;
        }
    }
    return false;
}

export function hasFalse(...args) {
    for (let i = 0; i < args.length; i++) {
        console.log(...args);
        if (!args[i]){
            return true;
        }
    }
    return false;
}

export function hasEmptyStr(...args) {
    for (let i = 0; i < args.length; i++) {
        if (args[i] === ''){
            return true;
        }
    }
    return false;
}