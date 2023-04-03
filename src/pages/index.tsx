import { useContext } from "react";
import Layout from "../../components/Layout/Layout";
import LoginModal from "../../components/modals/LoginModal";
import RegisterModal from "../../components/modals/RegisterModal";
import { AuthContext } from "../../context/AuthContext";


export default function Home() {
  const { currentUser } = useContext(AuthContext);


  return (
    <>
      <RegisterModal/>
      <LoginModal/>
      <Layout/>
    </>
  )
}
