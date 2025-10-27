

export const researchValidator = (
    title=undefined,
    author=undefined,   
    abstract=undefined,
    department=undefined,
    category=undefined,
    keywords=undefined,
    methodology=undefined,
    status=undefined,
    fundingInfo=undefined,
    email=undefined,
    phonenumber=undefined,
    instituteAddress=undefined
)=>{
   
    const emailregex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const stringregex = /^[a-zA-Z,. !\?#]$/
    const addressregex = /^[a-zA-Z0-9,. ]$/
    const phoneRegex = /^01[3-9]{1}[0-9]{8}$/

    if(!stringregex.test(title) && title){
        return {success:false,message:'invalid title'}
    }
    if(!stringregex.test(author) && author){
        return {success:false,message:'invalid author name'}
    }
    if(!stringregex.test(abstract) && abstract){
        return {success:false,message:'invalid abstract'}
    }
    if(!stringregex.test(department) && department){
        return {success:false,message:'invalid department'}
    }
    if(!stringregex.test(category) && category){
        return {success:false,message:'invalid category'}
    }
    if(!stringregex.test(keywords) && keywords){
        return {success:false,message:'invalid keywords'}
    }
    if(!stringregex.test(methodology)){
        return {success:false,message:'invalid methodology format'}
    }
    if(!stringregex.test(status)){
        return {success:false,message:'invalid status'}
    }
    if(!addressregex.test(instituteAddress)){
        return {success:false,message:'invalid address'}
    }
    if(!emailregex.test(email)){
        return {success:false,message:'invalid email'}
    }
    if(!stringregex.test(fundingInfo)){
        return {success:false,message:'invalid funding info'}
    }
    if(!phoneRegex.test(phonenumber)){
        return {success:false,message:'invalid phone number'}
    }

    return {success:true,message:'Success'}
    

   
}