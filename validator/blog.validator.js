
export const blogValidator = (title=undefined,author=undefined,category=undefined)=>{
    
    const stringregex = /[a-zA-Z0-9,. \?!]/

    if(!stringregex.test(title) && title){
        return {success:false,message:'invalid title'}
    }
    if(!stringregex.test(author) && author){
        return {success:false,message:'invalid author name'}
    }
    if(!stringregex.test(category) && category){
        return {success:false,message:'invalid category'}
    }
    
    return {success:true,message:'Success'}
    

}
