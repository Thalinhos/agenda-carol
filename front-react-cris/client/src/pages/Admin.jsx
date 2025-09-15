import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { CardEvent } from '../components/CardEvent';
import { mainUrl } from '../url';



export default function Admin() {

    const url = mainUrl

    const navigate = useNavigate()

    useEffect(()=> {

        document.title = 'Admin Dashboard';


        const verifyToken = async () => {
            try {
                const token = localStorage.getItem('token');
            
                if(!token){ navigate('/login'); }

                const response = await fetch( mainUrl + '/verify', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${token}`
                    }
                  });
                
                if(!response.ok){ navigate('/login'); }

                const data = await response.json();

                if(data.errorMessage){ navigate('/login'); }

                // if(data.message){ alert("Sucesso ao efetuar login, meu chapa", data.message); } // EXCLUIR DEPOIS
            } 
            catch (error) { navigate('/login'); }
        }
        verifyToken()
    }, [])

    return (
        <>
            
            <div className="flex flex-col min-h-screen">
                            <Header pagename={"Admin Dashboard"}/>
                            
                            
                            <div className="container mx-auto  flex-1 overflow-auto  px-1">
                                <div>
            
                          
                                    <CardEvent/>

            
                                </div>
                            </div>
                            
            
                            <Footer />
                        </div>



        </>
    )
}