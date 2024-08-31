import React, {useRef, useEffect} from "react";
import '../styles/budget.css'

const Cell = ({value, onChange, onClick, onKeyDown}) => {

    const inputRef = useRef(null);

    const handleChange = (e) => {
        onChange(e.target.value);
    };

    const handleClick = () => {
        onClick();
    };

    const handleKeyDown = (e) => {
        if(onKeyDown){
            onKeyDown(e);
        }
    };

    useEffect(() => {
        if(inputRef.current && inputRef.current === document.activeElement){
            inputRef.current.focus();
        }
    }, []);
    return (
        <input
            type = "text"
            value={value}
            onChange={handleChange}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            ref={inputRef}
            className="cell"
        >
        </input>
    );
};
export default Cell;