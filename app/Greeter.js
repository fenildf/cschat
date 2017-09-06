/*
* @Author: victorsun
* @Date:   2017-09-05 10:03:23
* @Last Modified by:   victorsun
* @Last Modified time: 2017-09-06 14:36:44
*/


// Greeter.js
import React, {Component} from 'react';
// var config = require('./config.json');
import config from './config.json';
import styles from './Greeter.css';//导入
import './Greeter.less';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';

class Greeter extends Component{
  render() {
    return (
      // <div className={styles.root}>//添加类名
      <div className="root">//添加类名
        {config.greetText}
      </div>
    );
  }
}
export default Greeter

// module.exports = function() {
//   var greet = document.createElement('div');
//   greet.textContent = config.greetText;
//   return greet;
// };
