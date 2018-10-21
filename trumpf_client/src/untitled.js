					// <Row>
					//  	<Col xs="12" className="row-buffer">
					// 		<svg height="850" width="1000" style={{'position':'relative','zIndex':500,'pointerEvents':'none'}}>
					// 			{this.state.areas.map((a, idx) => {
					// 				let j = JSON.parse(a.shape)
					// 				let x = 0
					// 				let y = 0
					// 				let count = 0
					// 				let str = ''
					// 				j.coordinates[0].map(a => {
					// 					str += (this.scaleX(parseFloat(a[0])))+','+(this.scaleY(parseFloat(a[1])))+' '
					// 					x += this.scaleX(parseFloat(a[0]))
					// 					y += this.scaleY(parseFloat(a[1]))
					// 					count += 1
					// 				})
					// 		  		return (
					// 		  			<g key={idx}>
					// 						<polygon key={idx} points={str} fill="#CECECE" opacity="0.7" stroke="#000000" strokeWidth="2" />
					// 						<text x={x/count} y={y/count} fontFamily="sans-serif" fontSize="12px" fill="red">{a.name}</text>
					// 					</g>
					// 				)}
					// 		  	)}
					// 		  	Sorry, your browser does not support inline SVG.
					// 		</svg>    
					// 		<footer className="footer">
					// 		    <img src="/map.png" alt="" useMap="#Map" name="#Map" id="map" style={{'zIndex': -1}} width="1000"/>
					// 		    <map name="Map" id="Map"></map>
					// 		</footer>
					//  	</Col>
					// </Row>	