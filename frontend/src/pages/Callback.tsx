import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Callback() {
  const { user, isLoading } = useAuth0();
  const navigate = useNavigate();


  useEffect(() => {

    async function getExistingTrainingsplan(){
        if (!isLoading && user) {
          if(user.sub){

            const res_user = await fetch(`http://localhost:3000/api/user/${encodeURIComponent(user.sub)}`);
            if(!res_user.ok){
              
              const res_newuser = await fetch(`http://localhost:3000/api/user`, {
                method: "POST",
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ "auth0id": user.sub, "email": user.email })
              });
              
              if(!res_newuser.ok){
                console.log("fehler beim erstellen");
                navigate("/");
                return;
              }                  
            }
            
            const res_trainingsplan = await fetch(`http://localhost:3000/api/trainingsplan/${encodeURIComponent(user.sub)}`);
            if(!res_trainingsplan.ok) {
              navigate("/onboarding");
            }
            else{
              navigate("/dashboard");
            }
          }
          else{
            console.log("keine user.sub");
            navigate("/");
          }
        }
    }
    getExistingTrainingsplan();
  }, [isLoading, user]);

  return <div>Loading…</div>;
}
