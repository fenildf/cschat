/*
* @Author: victorsun
* @Date:   2017-09-05 10:03:16
* @Last Modified by:   victorsun
* @Last Modified time: 2017-09-05 10:38:20
*/
//main.js 
import React from 'react';
import {render} from 'react-dom';
import Greeter from './Greeter';

import './main.css';//使用require导入css文件

render(<Greeter />, document.getElementById('root'));