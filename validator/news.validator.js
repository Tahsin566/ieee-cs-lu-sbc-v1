export const newsValidator = (title=undefined,author=undefined,tags=undefined,category=undefined)=>{
    
    const stringregex = /[a-zA-Z0-9,. !\?]*/

    if(!stringregex.test(title) && title){
        return {success:false,message:'invalid title'}
    }
    if(!stringregex.test(author) && author){
        return {success:false,message:'invalid author'}
    }
    if(!stringregex.test(category) && category){
        return {success:false,message:'invalid category'}
    }
    tags ? tags.foreach((tag)=>{
        if(!stringregex.test(tag) && tag){
            return {success:false,message:'invalid tag'}
        }
    }):null
    
    return {success:true,message:'Success'}
}