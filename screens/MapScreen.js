import React, { Component } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { MapView, Permissions } from 'expo';
import { connect } from 'react-redux';
import { Button, Icon, SearchBar } from 'react-native-elements';

import * as actions from '../actions';


class MapScreen extends Component {
    static navigationOptions = {
        title: 'Map',
        tabBarIcon: ({ tintColor }) => {
                return <Icon name="my-location" size={30} color={tintColor} />;
        }    
    }
    
    state = {
        region: {
            latitude: 41.8781,
            longitude: -87.6298,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
        },
        mapLoaded: false
    }

    async componentDidMount() {
        await Permissions.askAsync(Permissions.LOCATION);
        this.setState({ mapLoaded: true });
    }

    onRegionChangeComplete = (region) => {
        console.log(region);
        this.setState({ region });
    }

    onButtonPress = () => {
        this.props.fetchJobs(this.state.region, this.state.searchedJob, () => { // Passing a function that navigates to deck as a second argument to fetchJobs. fetchJobs doesn't have access to the navigation prop so this allows the switch to the deck screen after the jobs are searched for on the map screen.
            this.props.navigation.navigate('deck');
        });
    }

    onSearchChange = (searchedJob) => {
        this.setState({ searchedJob });
    }

    render() {
        if (!this.state.mapLoaded) {
            return (
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <ActivityIndicator size="large" />
                </View>
            );
        }
        return (
            <View style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>
                    <MapView
                        style={{ flex: 1 }}
                        region={this.state.region}
                        onRegionChangeComplete={this.onRegionChangeComplete}
                    />
                </View>
                <SearchBar
                        lightTheme
                        round
                        clearIcon
                        onChangeText={this.onSearchChange}
                        icon={{ type: 'font-awesome', name: 'search' }}
                        placeholder='Type Here...' 
                        containerStyle={{ position: 'absolute', top: 20, right: 10, left: 10, justifyContent: 'center' }}
                    />

                <View style={styles.buttonContainer}>
                    <Button 
                        large
                        title="Search This Area"
                        backgroundColor="#009688"
                        icon={{ name: 'search' }}
                        onPress={this.onButtonPress}
                    />
                </View>
            </View>
        );
    }
}

const styles = {
    buttonContainer: {
        positions: 'absolute',
        bottom: 20,
        left: 0,
        right: 0
    }
}

export default connect(null, actions)(MapScreen);