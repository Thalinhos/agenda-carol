// import { CardEvent } from "../components/CardEvent";
import { CalendarComponent } from "../components/CalendarComponent";
import { useEffect } from "react";

import 'bootstrap/dist/css/bootstrap.min.css';

export default function Home() {


    useEffect(() => {
        document.title = 'Minha Agenda';
      }, []); 

    const date = new Date(); 
    let nomeDoMes = date.toLocaleString('pt-BR', { month: 'long' });
    nomeDoMes = nomeDoMes.charAt(0).toUpperCase() + nomeDoMes.slice(1);
    const nomeDoAno = date.getFullYear();

    return (
        <>
            <div className="flex flex-col min-h-screen">

                <div className="flex items-center justify-center mt-14 mb-4">
                    <h1 className="text-2xl font-bold">
                        {nomeDoMes + " de " + nomeDoAno}
                    </h1>
                </div>
                
                
                <div className="container mx-auto  flex-1 overflow-auto  px-1">
                    <div>
                        <CalendarComponent />
                    </div>
                </div>
                

          
            </div>
        </>
    )
}