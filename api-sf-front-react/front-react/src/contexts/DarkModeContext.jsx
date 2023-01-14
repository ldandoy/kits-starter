import {createContext, useState, useEffect} from 'react'

const DarkModeContext = createContext()

const DarkModeProvider = ({children}) => {
	const [darkMode, setDarkMode] = useState(false)
	
	const toggleDarkMode = () => {
		localStorage.setItem('darkMode', String(!darkMode));
		setDarkMode(!darkMode)
	}

	useEffect(() => {
		const lsDark = JSON.parse(localStorage.getItem('darkMode'));
		if (lsDark !== undefined && lsDark !== null) {
			setDarkMode(lsDark);
		} else if (
			window.matchMedia &&
			window.matchMedia('(prefers-color-scheme: light)').matches
		  ) {
			localStorage.setItem('darkMode', String(false));
			setDarkMode(false);
		  }
	}, []);

	return (
		<DarkModeContext.Provider value={{darkMode, toggleDarkMode}}>
			{children}
		</DarkModeContext.Provider>
	)
}

export {DarkModeContext, DarkModeProvider};