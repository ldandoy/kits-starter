import {useContext} from 'react'
import { FaSun, FaMoon } from 'react-icons/fa';

import {DarkModeContext} from '../contexts/DarkModeContext'

const Lightswitch = () => {
    const {darkMode, toggleDarkMode} = useContext(DarkModeContext)

    const handleClick = () => {
        toggleDarkMode()
    }

    return (
        <span
          tabIndex={0}
          role="button"
          aria-label="light"
          onClick={handleClick}
        >
          <span>
            {darkMode ? (
              <span className='yellow'><FaSun /></span>
            ) : (
              <FaMoon />
            )}
          </span>
        </span>
    )
}

export default Lightswitch