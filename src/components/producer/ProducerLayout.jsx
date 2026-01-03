import React from 'react'
import ProducerSidebar from './ProducerSidebar'
import '../../styles/ProducerLayout.css'

const ProducerLayout = ({ children }) => {
	return (
		<div className="producer-layout">
			<ProducerSidebar />
			<div className="producer-main-content">
				{children}
			</div>
		</div>
	)
}

export default ProducerLayout
