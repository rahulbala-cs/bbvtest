import React from 'react'
import { createDrawerNavigator, DrawerToggleButton } from '@react-navigation/drawer'
import { COLORS } from '../config/constants'
// Remove old bottom tab navigator from Home
// import TabNavigator from './TabNavigator'
import VoteHubScreen from '../screens/VoteHubScreen'
import HelpScreen from '../screens/HelpScreen'
import ContactScreen from '../screens/ContactScreen'
import AboutScreen from '../screens/AboutScreen'
import PrivacyScreen from '../screens/PrivacyScreen'
import TermsScreen from '../screens/TermsScreen'

const Drawer = createDrawerNavigator()

export default function DrawerNavigator() {
	return (
		<Drawer.Navigator
			screenOptions={{
				headerShown: false, // Disable drawer headers, we'll add our own
			}}
		>
			<Drawer.Screen 
				name='Home' 
				component={VoteHubScreen}
			/>
			<Drawer.Screen name='Help' component={HelpScreen} />
			<Drawer.Screen name='Contact' component={ContactScreen} />
			<Drawer.Screen name='About' component={AboutScreen} />
			<Drawer.Screen name='Privacy' component={PrivacyScreen} />
			<Drawer.Screen name='Terms' component={TermsScreen} />
		</Drawer.Navigator>
	)
}