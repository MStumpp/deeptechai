import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import { Button, Progress, Pagination, PaginationItem, PaginationLink, ButtonGroup, Container, 
	Row, Col, Table, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, TabContent, TabPane, 
	Nav, NavItem, NavLink, InputGroup, InputGroupAddon, InputGroupButtonDropdown, 
	InputGroupDropdown, Input, InputGroupText } from 'reactstrap';
import classnames from 'classnames';
var BarChart = require("react-chartjs").Bar;
var QRCode = require('qrcode.react');
import { Link } from 'react-router-dom'
import { BrowserRouter } from 'react-router-dom'
import { withRouter } from 'react-router'

import _ from 'lodash'
import queryString from 'query-string'

import client from './client';
var crypto = require('crypto');

import DatePicker from 'react-datepicker';

class Home extends React.Component {

	constructor(props) {
		super(props);

	    this.toggle = this.toggle.bind(this);
	   	this.clickAddress = this.clickAddress.bind(this);
	   	this.onChangeStart = this.onChangeStart.bind(this);
	   	this.onChangeEnd = this.onChangeEnd.bind(this);

	   	this.toggleShowPositions = this.toggleShowPositions.bind(this);
	   	this.toggleShowImportantAreas = this.toggleShowImportantAreas.bind(this);
	   	this.toggleShowAreas = this.toggleShowAreas.bind(this);

	   	this.prevClick = this.prevClick.bind(this);
	   	this.nextClick = this.nextClick.bind(this);

	    this.state = {
	     	dropdownOpen: false,
	     	addresses: [],
	     	positions: [],
	     	areas: [],
	     	currentAddress: "145401774635637016",
	     	start: moment('29/08/2018', 'DD/MM/YYYY'),
	     	end: moment('30/08/2018', 'DD/MM/YYYY'),
	     	kpi: {
	     		avgWaitTime: 'n/a',
	     		avgProcTime: 'n/a'
	     	},
	     	showPositions: true,
	     	showImportantAreas: false,
	     	showAreas: false,
	     	image: ''
	    };	
	}

	componentDidMount() {
		this.fetchAddresses()
	}

	fetchAddresses() {
		this.setState({
			addresses : []
		}, () => {
			client({method: 'GET', path: 'http://localhost:8080/addresses'}).done(response => {
				this.setState({
					addresses : response.entity
				})
			})
		})
	}

	fetchPositions() {
		if (this.state.currentAddress) {
			this.setState({
				positions : []
			}, () => {
				client({method: 'GET', path: 'http://localhost:8080/positions?address=' + this.state.currentAddress + '&start=' + this.state.start + '&end=' + this.state.end}).done(response => {
					this.setState({
						positions : response.entity.positions
					})
				})
			})
		}
	}

	fetchAreas() {
		this.setState({
			areas : []
		}, () => {
			client({method: 'GET', path: 'http://localhost:8080/areas?address=' + this.state.currentAddress + '&start=' + this.state.start + '&end=' + this.state.end}).done(response => {
				this.setState({
					areas : response.entity
				})
			})
		})
	}

	fetchKPI() {
		this.setState({
			kpi: {
	     		avgWaitTime: 'n/a',
	     		avgProcTime: 'n/a'
	     	}
		}, () => {
			client({method: 'GET', path: 'http://localhost:8080/kpis?address=' + this.state.currentAddress + '&start=' + this.state.start + '&end=' + this.state.end}).done(response => {
				this.setState({
					kpi : response.entity
				})
			})
		})
	}

	toggle() {
		this.setState(prevState => ({
		  	dropdownOpen: !prevState.dropdownOpen
		}));
	}

	clickAddress(e) {
		let currentAddress = e.currentTarget.textContent
		this.setState({
			currentAddress: currentAddress
		}, () => {
			this.fetchPositions()
			this.fetchAreas()
			this.fetchKPI()
		});	
	}

	onChangeStart(e) {
		this.setState({
			start: e
		}, () => {
			this.fetchPositions()
			this.fetchAreas()
			this.fetchKPI()
		});	
	}

	onChangeEnd(e) {
		this.setState({
			end: e
		}, () => {
			this.fetchPositions()
			this.fetchAreas()
			this.fetchKPI()
		});	
	}

	scaleX(x) {
		let xMax = 53.6;
		let xMin = -62.5;

		let xxMax = 1000;
		let xxMin = 0;

		return xxMin + (xxMax - xxMin) * ((x-xMin) / (xMax - xMin))
	}

	scaleY(y) {
		let yMax = 14.325;
		let yMin = -67.52

		let yyMax = 720;
		let yyMin = 10;

		return yyMin + (yyMax - yyMin) * ((y-yMin) / (yMax - yMin))
	}

	toggleShowPositions() {
		this.setState({
			showPositions: !this.state.showPositions,
			showImportantAreas: false,
			showAreas: false
		})
	}

	toggleShowImportantAreas() {
		this.setState({
			showImportantAreas: !this.state.showImportantAreas,
			showPositions: false,
			showAreas: false
		})
	}

	toggleShowAreas() {
		this.setState({
			showAreas: !this.state.showAreas,
			showImportantAreas: false,
			showPositions: false
		})
	}

	prevClick() {
		console.log('prevClick')
		this.setState({
			start: this.state.start.subtract(1, 'days')
		}) 
	}

	nextClick() {
		console.log('nextClick')
		this.setState({
	     	end: this.state.end.add(1, 'days')
		})
	}

	render() {
		if (!this.state.assetType) {
			return (
				<Container>
					<Row>
						<Col xs="2" className="row-buffer">
							<Button color="secondary" onClick={this.prevClick}>Prev</Button>{' '}
							<Button color="secondary" onClick={this.nextClick}>Next</Button>{' '}
						</Col>
						<Col xs="3" className="row-buffer">
					  		<InputGroup>
					        	<InputGroupAddon addonType="prepend">Start</InputGroupAddon>
								<DatePicker
								    selected={this.state.start}
								    onChange={this.onChangeStart}
								    dateFormat="L"
								/>
					      	</InputGroup>
					 	</Col>
						<Col xs="3" className="row-buffer">
					  		<InputGroup>
					        	<InputGroupAddon addonType="prepend">End</InputGroupAddon>
					        	<DatePicker
								    selected={this.state.end}
								    onChange={this.onChangeEnd}
								    dateFormat="L"
								/>
					      	</InputGroup>
					 	</Col>
					 	<Col xs="4" className="row-buffer">
					 		<Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle} style={{width: 242}}>
					        <DropdownToggle caret style={{width: 242}}>
					        	{this.state.currentAddress}
					        </DropdownToggle>
					        <DropdownMenu style={{width: 242}}>
	  							{this.state.addresses.map((a, idx) => {
							  		return (
										<DropdownItem key={idx} onClick={this.clickAddress}>{a}</DropdownItem>
									)}
							  	)}
					       	</DropdownMenu>
					      </Dropdown>
					 	</Col>
					</Row>	
					<Row>
					 	<Col xs="12" className="row-buffer">
							<svg height="720" width="1000" style={{'position':'relative','zIndex':500,'pointerEvents':'none'}}>
								{this.state.areas.map((a, idx) => {
									if (this.state.showAreas) {
										let j = JSON.parse(a.shape)
										let x = 0
										let y = 0
										let count = 0
										let str = ''
										j.coordinates[0].map(a => {
											str += (this.scaleX(parseFloat(a[0])))+','+(this.scaleY(parseFloat(a[1])))+' '
											x += this.scaleX(parseFloat(a[0]))
											y += this.scaleY(parseFloat(a[1]))
											count += 1
										})
								  		return (
								  			<g key={idx}>
												<polygon key={idx} points={str} fill="#CECECE" opacity="0.7" stroke="#000000" strokeWidth="2" />
												<text x={x/count} y={y/count} fontFamily="sans-serif" fontSize="12px" fill="red">{a.name}</text>
											</g>
										)}
									}
							  	)}
							  	Sorry, your browser does not support inline SVG.
							</svg>    
							<footer className="footer">
								{this.state.showPositions && (
									<img src={"/" + this.state.currentAddress + '_' + this.state.start.format("DD-MM-YYYY") + '_' + this.state.end.format("DD-MM-YYYY") + '_positions.png'} alt="" useMap="#Map" name="#Map" id="map" style={{'zIndex': -1}} width="1000"/>
								)}
								{this.state.showImportantAreas && (
									<img src={"/" + this.state.currentAddress + '_' + this.state.start.format("DD-MM-YYYY") + '_' + this.state.end.format("DD-MM-YYYY") + '_area.png'} alt="" useMap="#Map" name="#Map" id="map" style={{'zIndex': -1}} width="1000"/>
								)}
								{this.state.showAreas && (
									<img src={"/map.png"} alt="" useMap="#Map" name="#Map" id="map" style={{'zIndex': -1}} width="1000"/>
								)}
								{!this.state.showPositions && !this.state.showImportantAreas && !this.state.showAreas && (
									<img src={"/map.png"} alt="" useMap="#Map" name="#Map" id="map" style={{'zIndex': -1}} width="1000"/>
								)}
							    <map name="Map" id="Map"></map>
							</footer>
					 	</Col>
					</Row>
					<Row>
					 	<Col xs="12" className="row-buffer">
					 		<InputGroup style={{width: '1000px' }}>
								<InputGroupAddon addonType="prepend">
									<InputGroupText>
										<Input addon type="checkbox" onChange={this.toggleShowPositions} checked={this.state.showPositions}/>
									</InputGroupText>
								</InputGroupAddon>
								<Input placeholder="Show Positions" />
							</InputGroup>
							<InputGroup style={{width: '1000px' }}>
								<InputGroupAddon addonType="prepend">
									<InputGroupText>
										<Input addon type="checkbox" onChange={this.toggleShowImportantAreas} checked={this.state.showImportantAreas}/>
									</InputGroupText>
								</InputGroupAddon>
								<Input placeholder="Important Areas" />
							</InputGroup>
							<InputGroup style={{width: '1000px' }}>
								<InputGroupAddon addonType="prepend">
									<InputGroupText>
										<Input addon type="checkbox" onChange={this.toggleShowAreas} checked={this.state.showAreas}/>
									</InputGroupText>
								</InputGroupAddon>
								<Input placeholder="Show Areas" />
							</InputGroup>
					 	</Col>
					</Row>
					<Row>
					 	<Col xs="5" className="row-buffer" style={{backgroundColor:'#E8E8E8', padding:'20px', margin:'5px' }}>
					 		<center><b>Avg. Wait time:<br/>{this.state.kpi.avgWaitTime}</b></center>
					 	</Col>
					 	<Col xs="5" className="row-buffer" style={{backgroundColor:'#E8E8E8', padding:'20px', margin:'5px', marginLeft: '50px'}}>
					 		<center><b>Avg. Proc time:<br/>{this.state.kpi.avgProcTime}</b></center>
					 	</Col>
					</Row>
				</Container>
			)
		}
	}
}

export default withRouter(Home);

