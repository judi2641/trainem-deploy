import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Callback() {
  const { user, isLoading } = useAuth0();
  const navigate = useNavigate();


  useEffect(() => {

    async function getExistingTrainingsplan(){
        if (!isLoading && user) {
            const res = await fetch(`http://localhost:3000/api/trainingsplan/${user.email}`);
            console.log(res);
            if(!res.ok) {
                navigate("/onboarding");
            }
            else{
                navigate("/dashboard");
            }
        }
    }
    getExistingTrainingsplan();
  }, [isLoading, user]);

  return <div>Loading…</div>;
}
