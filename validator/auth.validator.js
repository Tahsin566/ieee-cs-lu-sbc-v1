
export const authValidator = (username,email,IEEEID,memberType)=>{
    
    const emailregex = /^[a-z0-9]+@(?:gmail\.com|lus\.ac\.bd)$/i

    const localregex = /^lm\d{5,}$/

    const usernameregex = /^[a-zA-Z .]{4,}$/

    const IEEEIDregex = memberType?.toLowerCase()?.trim() === 'local' ? localregex : /^[0-9]+$/
    if(!(usernameregex.test(username)) && username){
        return {success:false,message:'username can contain only alphabets and numbers and must be atleast 3 characters long'}
    }
    if(!(emailregex.test(email)) && email){
        return {success:false,message:'invalid email'}
    }
    if(!(IEEEIDregex.test(IEEEID)) && IEEEID){
        return {success:false,message:`invalid ${memberType?.toLowerCase()} IEEE ID, ${memberType?.toLowerCase()==="local" ? 'IEEE ID must be of 5 digits and start with lm': 'IEEE ID must be a number'}`}
    }
    return {success:true,message:'Success'}
}
