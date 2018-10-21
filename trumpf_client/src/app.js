import React from 'react';
import ReactDOM from 'react-dom';

import { Button, Progress } from 'reactstrap';
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import { Container, Row, Col } from 'reactstrap';
import { Table } from 'reactstrap';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { TabContent, TabPane, Nav, NavItem, NavLink, Card, CardTitle, CardText } from 'reactstrap';
import classnames from 'classnames';
//import Bar from 'react-chartjs';
var BarChart = require("react-chartjs").Bar;
var QRCode = require('qrcode.react');
import { Link } from 'react-router-dom'
import { BrowserRouter } from 'react-router-dom'
import {browserHistory} from 'react-router';

import queryString from 'query-string'

import client from './client';

import Home from './home';

ReactDOM.render(
 	<BrowserRouter>
    	<Home/>
  	</BrowserRouter>,
  	document.getElementById('app')
);

module.hot.accept();