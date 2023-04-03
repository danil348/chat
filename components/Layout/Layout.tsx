import React from 'react';
import { BiLogInCircle } from 'react-icons/bi';
import { BsDiscord } from 'react-icons/bs';
import useChats from '../../hooks/useChats';
import useFoo from '../../hooks/useFoo';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import useLoginModal from '../../hooks/useLoginModal';
import useRegisterModal from '../../hooks/useRegisterModal';
import SearchModal from '../modals/SearchModal/SearchModal';
import Chats from './Chats/Chats';
import Foo from './Foo/Foo';
import NavBarItem from './NavBarItem/NavBarItem';

interface ILayout { 
	children?: React.ReactNode;
}

const Layout: React.FC<ILayout> = ({children}) => {

  const loginModal = useLoginModal()
  const registerModal = useRegisterModal()
	const chats = useChats()
	const foo = useFoo()
	
  const { removeItem } = useLocalStorage();
	
	if(loginModal.isOpen == true || registerModal.isOpen == true){
		return
	}


	return (
		<div className="layout__content">
			<SearchModal/>
			<div className="layout__navBar">
				<NavBarItem 
					onClick={() => {
						foo.onClose()
						chats.onOpen()
					}}
					icon={<BsDiscord size={26} color='white'/>}
					isOpen={chats.isOpen}
					prompt='Личные сообщения'
					/>
				<NavBarItem 
					onClick={() => {
						chats.onClose()
						foo.onOpen()
					}}
					isOpen={foo.isOpen}
					prompt='Foo'
					/>
					<NavBarItem 
					onClick={() => {
						chats.onClose()
						foo.onClose()
						removeItem("password")
						removeItem("email")
						registerModal.onOpen();
					}}
					icon={<BiLogInCircle size={26} color='white'/>}
					prompt='Выйти'
					/>
			</div>
			<Foo isOpen={foo.isOpen}/>
			<Chats isOpen={chats.isOpen}/>
		</div>
	)
}

export default Layout