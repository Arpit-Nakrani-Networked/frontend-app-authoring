import React from 'react'
import style from './SolidSvgComponent.module.scss'

interface IProps {
	width?: number,
	height?: number,
	iconColor?: string,
	url: string
	fit?: boolean
	defaultClass?: any
	isPrimaryColor?: boolean
	onClick?: any
	isIconColor?: boolean
	styles?: any
}

const SolidSvgComponent = (props: IProps) => {
	const { width, height, iconColor, url, fit, defaultClass, isPrimaryColor, styles, isIconColor, onClick, ...p } = props

	return (
		<div className={`${style.SvgIcon} ${isPrimaryColor ? style.primary : ''} ${isIconColor ? style.iconColor : ''} ${defaultClass}`} onClick={onClick} style={{
			width,
			height,
			backgroundColor: iconColor,
			mask: `url(${url})`,
			WebkitMask: `url(${url})`,
			maskSize: fit ? "contain" : "auto",
			WebkitMaskSize: fit ? "contain" : "auto",
			maskRepeat: 'no-repeat',
			WebkitMaskRepeat: 'no-repeat',
			...styles
		}} {...p}></div>
	)
}

export default SolidSvgComponent