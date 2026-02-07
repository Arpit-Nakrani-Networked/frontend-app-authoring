import React, { useEffect, useRef, useState } from 'react';
// import loaderImage from '../../../assets/interactive-loader/interactiveLoader.png';
import './IntractiveLoader.scss';


export default function IntractiveLoader() {
	//@ts-ignore
	const lang = navigator.language || navigator?.userLanguage
	const messageList_en = [ "Setting up your course ...", "Preparing course resources...", "Loading course settings...", "Almost there! Just a few more seconds..."];
	const messageList_es = ["Configurando tu curso...", "Preparando los recursos del curso...", "Cargando la configuración del curso...", "¡Casi listo! Solo unos segundos más..."];
	const messageList = lang === "es" ? messageList_es : messageList_en
	const [current, setCurrent] = useState(0);
	const intervalRef = useRef();

	useEffect(() => {
		intervalRef.current = setInterval(() => {
			if (current < messageList.length - 1) {
				setCurrent(current + 1);
			} else {
				clearInterval(intervalRef.current);
			}
		}, 2500);
		return () => {
			clearInterval(intervalRef.current);
		}
	}, [current]);

	return (
		<div className='loaderWrapper'>
			{/* <img className='loaderImage' src={loaderImage} alt="loader" width={105} height={105} /> */}
			<div className='message'>{messageList[current]}</div>
			<div className="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
		</div>
	)
}