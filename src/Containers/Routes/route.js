import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import HomeScreen from '../../components/Home/home';
import ResultScreen from '../../components/Result/result';
import BazarScreen from '../../components/Bazar/bazar';
import PrivateScreen from '../../components/PrivateWorks/privateWork';
// import MoreScreen from './MoreScreen';

const Tab = createBottomTabNavigator();
const HomeStack = createStackNavigator();
const ResultStack = createStackNavigator();
const BazarStack = createStackNavigator();
const PrivateStack = createStackNavigator();
// const MoreStack = createStackNavigator();

const HomeStackScreen = () => {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen name="Home" component={HomeScreen} />
      {/* Add other nested screens for Home tab here */}
    </HomeStack.Navigator>
  );
};

const ResultStackScreen = () => {
  return (
    <ResultStack.Navigator>
      <ResultStack.Screen name="Result" component={ResultScreen} />
      {/* Add other nested screens for Result tab here */}
    </ResultStack.Navigator>
  );
};

const BazarStackScreen = () => {
  return (
    <BazarStack.Navigator>
      <BazarStack.Screen name="Bazar" component={BazarScreen} />
      {/* Add other nested screens for Bazar tab here */}
    </BazarStack.Navigator>
  );
};

const PrivateStackScreen = () => {
  return (
    <PrivateStack.Navigator>
      <PrivateStack.Screen name="Private" component={PrivateScreen} />
      {/* Add other nested screens for Private tab here */}
    </PrivateStack.Navigator>
  );
};

// const MoreStackScreen = () => {
//   return (
//     <MoreStack.Navigator>
//       <MoreStack.Screen name="More" component={MoreScreen} />
//       {/* Add other nested screens for More tab here */}
//     </MoreStack.Navigator>
//   );
// };

const BottomTabNavigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeStackScreen} />
        <Tab.Screen name="Result" component={ResultStackScreen} />
        <Tab.Screen name="Bazar" component={BazarStackScreen} />
        <Tab.Screen name="Private" component={PrivateStackScreen} />
        {/* <Tab.Screen name="More" component={MoreStackScreen} /> */}
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default BottomTabNavigator;
