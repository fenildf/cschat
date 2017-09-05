/*
* @Author: victorsun
* @Date:   2017-09-05 10:03:23
* @Last Modified by:   victorsun
* @Last Modified time: 2017-09-05 20:21:07
*/
// Greeter.js
// var config = require('./config.json');

// module.exports = function() {
//   var greet = document.createElement('div');
//   greet.textContent = config.greetText;
//   return greet;
// };

// Greeter.js
import React, {Component} from 'react';
import config from './config.json';
import styles from './Greeter.css';//导入
import './Greeter.less';

// import $ from './lib/jquery-2.2.4/jquery.min.js';
// require('./lib/jquery-2.2.4/jquery');
// const $ = require('./lib/jquery-2.2.4/jquery.min.js');
// import './lib/bootstrap-3.3.7/css/bootstrap.min.css';
// import './lib/bootstrap-3.3.7/js/bootstrap.min.js';

class Greeter extends Component{
  render() {
    return (
      // <div className={styles.root}>//添加类名
      <div className="root btn">//添加类名
        {config.greetText}
      </div>
    );
  }
}
// console.log($('div').text("111").text());
export default Greeter