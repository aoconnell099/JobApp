import React, { Component } from 'react';
import { View, Text, ScrollView, Platform, Image } from 'react-native';
import { connect } from 'react-redux';
import { MapView } from 'expo';
import { Card, Button, Icon } from 'react-native-elements';
import moment  from 'moment';
import { Location } from 'expo';
import Swipe from '../components/Swipe';
import * as actions from '../actions';

class DeckScreen extends Component {
    static navigationOptions = {
        title: 'Jobs',
        tabBarIcon: ({ tintColor }) => {
                return <Icon name="description" size={30} color={tintColor} />;
        }    
    }
    renderCard = (job) => {
        // Code below works but makes too many calls to geocode. Find possible workaround or use an api that provides coordinate locations for jobs
        // This methodology set local state to the geocoded coordinates of the job each time renderCard was called and passed that in as the initialRegion for more precise mapView on the job card
        // Must initialze state for this to work. Constructor was removed because it was no longer needed when sending the coordinates of the search through with the fetchJobs payload 
        //
        // const getRegion = async (job) => {
        //     try {
        //         console.log('before let');
        //         let  [{ latitude, longitude }] = await Location.geocodeAsync(job.location);
        //         console.log('getRegion');
        //         console.log(latitude);
        //         console.log(longitude);
        //         const region = {
        //             longitude,
        //             latitude,
        //             latitudeDelta: 0.045,
        //             longitudeDelta: 0.02
        //         };
        //         this.setState({region});
        //     } catch(e) {
        //         console.error(e);
        //         console.log('catch error in getRegion');
        //     }
        // };
        // getRegion(job);
        const date = moment(job.created_at).format('MMM Do');
        //console.log(job.company_logo);
        return (
            <Card title={job.title}>
                <View style={{ height: 300 }}>
                   <MapView
                        scrollEnabled={false}
                        style={{ flex: 1 }}
                        cacheEnabled={Platform.OS === 'android' ? true : false}
                        initialRegion={this.props.jobs.region}
                    >
                   </MapView> 
                </View>
                <View style={styles.detailWrapper}>
                    <Text>{job.company}</Text>
                    <Text>{date}</Text>
                </View>
                <ScrollView>
                    {this.renderScrollText(job)}
                </ScrollView>
            </Card>
        );
    }

    renderNoMoreCards = () => { // Arrow function gives Swipe access to 'this' in the context of the DeckScreen which has access to this.props.navigation. Could also .bind(this) to renderNoMoreCards inside of <Swipe>
        return (
            <Card title="No More Jobs">
                <Button
                    title="Back To Map"
                    large
                    icon={{ name: 'my-location' }}
                    backgroundColor="#0319F4"
                    onPress={() => this.props.navigation.navigate('map')}
                />
            </Card>
        );
    }
    renderScrollText(job) {
        return(
                <View style={{ height: 150 }}>
                    <View style={styles.detailWrapper}>
                    <Text>{job.description}</Text>
                    </View>
                </View>
        );
    }
    
    render() {
        return (
            <View style={{ marginTop: 10 }}>
                <Swipe
                    data={this.props.jobs.results}
                    renderCard={this.renderCard}
                    renderNoMoreCards={this.renderNoMoreCards}
                    onSwipeRight={job => this.props.likeJob(job)}
                    keyProp="id"
                />
            </View>
        );
    }
}

const styles = {
    container: {
      flex: 1,
      backgroundColor: '#fff'
    },
    detailWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 10
    },
    italics: {
        fontStyle: 'italic'
    }
  };

function mapStateToProps({ jobs }) {
    return { jobs }; // Jobs is an object containing the results array returned by github and the region object containing the coords of the search.
}

export default connect(mapStateToProps, actions)(DeckScreen);