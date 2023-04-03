import Layout from "../../components/Layout/Layout";
import LoginModal from "../../components/modals/LoginModal";
import RegisterModal from "../../components/modals/RegisterModal";


export default function Home() {
  return (
    <>
      <RegisterModal/>
      <LoginModal/>
      <Layout/>
    </>
  )
}
