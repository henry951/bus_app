import {AppRegistry} from 'react-native';
import App from './App';

if (module.hot) {
  module.hot.accept();
}
AppRegistry.registerComponent('React Native Web', () => App);
AppRegistry.runApplication('React Native Web', {
  initialProps: {},
  rootTag: document.getElementById('app-root'),
});


// import 'expo/build/Expo.fx';
// import { AppRegistry, Platform } from 'react-native';
// import withExpoRoot from 'expo/build/launch/withExpoRoot';

// import App from './App';
// import { createRoot } from "react-dom/client";

// AppRegistry.registerComponent('main', () => withExpoRoot(App));
// if (Platform.OS === 'web') {
//   const rootTag = createRoot(document.getElementById('app-root') ?? document.getElementById('main'));
//   const RootComponent = withExpoRoot(App);
//   rootTag.render(<RootComponent />);
// }