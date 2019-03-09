import React, { Component } from 'react';
import { 
    View, 
    Animated,
    PanResponder,
    Dimensions,
    LayoutAnimation,
    UIManager,
    Platform,
    PixelRatio
} from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = 0.25 * Dimensions.get('window').width
const SWIPE_OUT_DURATION = 250; //milliseconds

class Swipe extends Component {
    static defaultProps = {
        onSwipeRight: () => {},
        onSwipeLeft: () => {},
        keyProp: 'id'
    }

    constructor(props) {
        super(props);

        const position = new Animated.ValueXY();
        const panResponder = PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: (event, gesture) => {
                position.setValue({ x: gesture.dx, y: gesture.dy })
            },
            onPanResponderRelease: (event, gesture) => {
                if ( gesture.dx > SWIPE_THRESHOLD) {
                    this.forceSwipe('right');
                } else if ( gesture.dx < -SWIPE_THRESHOLD) {
                    this.forceSwipe('left');
                } else {
                    this.resetPosition();
                }
            }
        });

        this.state = { panResponder, position, index: 0 }; // Manually mutating state normally against rules of react. This case is what panResponder docs call for. Could do this.position = position and this.panResponder = panResponder. Leave as is to match documentation.
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.data !== this.props.data) { // Doesn't compare actual data, checks if they are the exact same array in memory
            this.setState({ index: 0})
        }
    }

    componentWillUpdate() {
        UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
        LayoutAnimation.spring();
    }

    forceSwipe(direction) {
        const x = direction === 'right' ? SCREEN_WIDTH : -SCREEN_WIDTH;
        Animated.timing(this.state.position, {
            toValue: { x, y: 0 },
            duration: SWIPE_OUT_DURATION
        }).start(() => this.onSwipeComplete(direction));
    }

    onSwipeComplete(direction) {
        const { onSwipeLeft, onSwipeRight, data } = this.props;
        const item = data[this.state.index];

        direction === 'right' ? onSwipeRight(item) : onSwipeLeft(item);
        this.state.position.setValue({ x: 0, y: 0 }); // Mutating position state value. Not normally how it's done, another example of panResponder documentation
        this.setState({ index: this.state.index + 1 }); // Not modifying state. This recreates/resets the existing state index value

    }

    resetPosition() {
        Animated.spring(this.state.position, {
            toValue: { x: 0, y: 0 }
        }).start();
    }

    getCardStyle() {
        const { position } = this.state;
        const rotate = position.x.interpolate({
            inputRange: [-SCREEN_WIDTH * 1.5, 0, SCREEN_WIDTH * 1.5],
            outputRange: ['-120deg', '0deg', '120deg']
        });

        return {
            ...position.getLayout(),
            transform: [{ rotate }] // es6 destructuring. rotate: rotate becomes rotate because of const rotate.
        };
    }

    renderCards() {
        if (this.state.index >= this.props.data.length) {
            return this.props.renderNoMoreCards();
        }

        const deck = this.props.data.map((item, i) => { // i is the index of a card in the DATA array. this.state.index is the index of the card currently being shown
            if ( i < this.state.index) { return null; } // Dont show cards in the list previous to the one being shown. i.e., the cards that have already been swiped 
            
            if (i === this.state.index) { // Show top card with panResponder and animated view attatched
                return (
                    <Animated.View
                        key={item[this.props.keyProp]}
                        style={[this.getCardStyle(), styles.cardStyle]}
                        {...this.state.panResponder.panHandlers}
                    >
                        {this.props.renderCard(item)}
                    </Animated.View>
                )
            }

            return ( // Stacks the rest of the cards underneath the top one using cardStyle
                <Animated.View 
                    key={item[this.props.keyProp]} 
                    style={[styles.cardStyle, { top: 5 * (i - this.state.index), zIndex: -i }]}
                >
                    {this.props.renderCard(item)} 
                </Animated.View>
            );
        });

        return Platform.OS === 'android' ? deck : deck.reverse(); // Workaround to get it to work on android. Originally return instead of const deck, and had .reverse() at the end of the function.
    }
    render() {
        return(
            <View>
                {this.renderCards()}
            </View>
        );
    }
}

const styles = {
    cardStyle: {
        position: 'absolute',
        width: SCREEN_WIDTH
    }
};

export default Swipe;