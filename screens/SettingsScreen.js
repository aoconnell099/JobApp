import React, { Component } from 'react';
import { View, Text, Platform } from 'react-native';
import { Button } from 'react-native-elements';
import { connect } from 'react-redux';
import { clearLikedJobs } from '../actions';

// Instead of wrapping onPress in an arrow function and calling it using clearLikedJobs() leave it as this.props... Dont need to bind because the function doesn't need/care about the context of 'this' 
class SettingsScreen extends Component {
    static navigationOptions = () => ({
        headerStyle: {
                marginTop: Platform.OS === 'android' ? 24 : 0
        }
    });
    
    render() {
        return (
            <View style={{ marginTop: 10 }}> 
                <Button 
                    title="Reset Liked Jobs"
                    large
                    icon={{ name: 'delete-forever' }}
                    backgroundColor="#F44336"
                    onPress={this.props.clearLikedJobs}
                />
            </View>
        );
    }
}
// Only need the clearLikedJobs action so destucture for cleaner code
export default connect(null, { clearLikedJobs })(SettingsScreen);