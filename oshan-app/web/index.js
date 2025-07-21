import { AppRegistry } from 'react-native';
import App from '../App';
import { Platform } from 'react-native';

// Set app name
AppRegistry.registerComponent('main', () => App);

// Web-specific setup
if (Platform.OS === 'web') {
  const rootTag = document.getElementById('root');
  AppRegistry.runApplication('main', { rootTag });
  
  // Set favicon
  const link = document.createElement('link');
  link.rel = 'icon';
  link.href = require('../assets/favicon.png');
  document.head.appendChild(link);
}