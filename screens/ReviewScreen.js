import React, { Component } from 'react';
import { View, Text, Platform, ScrollView, Linking } from 'react-native';
import { Button, Card, Icon } from 'react-native-elements';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';
import moment  from 'moment';
import { MapView } from 'expo';

class ReviewScreen extends Component {
    static navigationOptions = ({ navigation }) => ({
        title: 'Review Jobs',    
        headerRight: <Button 
                        title="Settings" 
                        onPress={() => {navigation.navigate('settings')}}
                        backgroundColor="rgba(0,0,0,0)" 
                        color="rgba(0, 122, 255, 1)" 
                        headerStyle={{ marginTop: Platform.OS === 'android' ? 24 : 0 }} 
                    />
    })
 
    renderLikedJobs() {
        return this.props.likedJobs.map(job => {
            const { company, url, created_at, title, id } = job; // Destructuring from job to simplify all of the uses of job.*
            const date = moment(created_at).format('MMM Do');
            return(
                <Card title={title} key={id}>
                    <View style={{ height: 200 }}>
                        <MapView
                            style={{ flex: 1 }}
                            cacheEnabled={Platform.OS === 'android'}
                            scrollEnabled={false}
                            initialRegion={this.props.region}
                        />
                        <View style={styles.detailWrapper}>
                            <Text style={styles.italics}>{company}</Text>
                            <Text style={styles.italics}>{date}</Text>
                        </View>
                        <Button 
                            title="Apply Now!"
                            backgroundColor="#03A9F4"
                            onPress={() => Linking.openURL(url)}
                        />
                    </View>
                </Card>
            );
        });
    }

    render() { 
        return (
            <ScrollView>
                {this.renderLikedJobs()}
            </ScrollView>
        );
    }
}

const styles = {
    italics: {
        fontStyle: 'italic'
    },
    detailWrapper: {
        marginTop: 10,
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-around'
    }
};

function mapStateToProps(state) {
    return { 
        likedJobs: state.likedJobs,
        region: state.jobs.region
    }
}

export default connect(mapStateToProps)(ReviewScreen);