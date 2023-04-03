import React from 'react';
import { BiLogInCircle } from 'react-icons/bi';
import { BsDiscord } from 'react-icons/bs';
import useChats from '../../hooks/useChats';
import useFoo from '../../hooks/useFoo';
import Chats from './Chats/Chats';
import Foo from './Foo/Foo';
import NavBarItem from './NavBarItem/NavBarItem';

interface ILayout { 
	children?: React.ReactNode;
}

const Layout: React.FC<ILayout> = ({children}) => {

	
	const chats = useChats()
	const foo = useFoo()

	return (
		<div className="layout__content">
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
					icon={<BiLogInCircle size={26} color='white'/>}
					isOpen={foo.isOpen}
					prompt='Выйти'
					/>
			</div>
			<Foo isOpen={foo.isOpen}/>
			<Chats isOpen={chats.isOpen}/>
		</div>
	)
}

export default Layout