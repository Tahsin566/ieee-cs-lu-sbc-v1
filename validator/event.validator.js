
export const eventValidator = (title=undefined, description=undefined, type=undefined) => {

    const stringRegex = /[a-zA-Z0-9,. !\?]/;

    if(!stringRegex.test(title) && title) {
        return { success: false, message: 'invalid title' }
    }
    if(!stringRegex.test(description) && description) {
        return { success: false, message: 'invalid description' }
    }
    if(!stringRegex.test(type) && type) {
        return { success: false, message: 'invalid type' }
    }

    return { success: true, message: 'Success' }
}