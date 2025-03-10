
"use client";
import { useRouter } from 'next/navigation'; 


const  Dasboard = () =>{
   const router = useRouter();
    const productListdetails= () =>{
        try{
             router.push('/admin/Addproduct');
        }catch(err){
            console.log('cannot goes to the link',err)
        }
    }
    const getproduct= () =>{
        try{
             router.push('/admin/Getproduct');
        }catch(err){
            console.log('cannot goes to the link',err)
        }
    }
    return(
        <div>

    <div>        
    <button onClick={productListdetails}>Addproduct</button>
    <button onClick={getproduct}>Getproduct</button>
    </div>
    <div>
    </div>
        </div>
    )
}
export default Dasboard;