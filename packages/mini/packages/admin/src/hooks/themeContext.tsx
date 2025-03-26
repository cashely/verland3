import { createContext, useState, useContext } from 'react';

const ThemeContext = createContext({
    theme: {
        primary: '#c696da',
        hover: '#00e1b8',
    },
    action: (() => {}) as any 
});

export default function useTheme():any{
    const context = useContext(ThemeContext);
    return context
}


export function ThemeProvider(props: any) {

    const [custome, setCustom] = useState({
        primary: '#c696da',
        hover: '#00e1b8',
    })
    return (
        <ThemeContext.Provider value={{ theme: custome, action: setCustom }}>
            {props.children}
        </ThemeContext.Provider>
    );
}