import React from 'react';
import { View, PanResponder, Animated, Dimensions } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_THRESHOLD = SCREEN_WIDTH * 0.25;

class Deck extends React.Component {


    constructor(props) {
        super(props);

        this.position = new Animated.ValueXY();
        this.panResponder = PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: (event, gesture) => {
                this.position.setValue({ x: gesture.dx, y: gesture.dy });
            },
            onPanResponderRelease: (event, gesture) => {
                if (gesture.dx > SCREEN_THRESHOLD) {
                    console.log('swiped right!');
                } else if (gesture.dx < -SCREEN_THRESHOLD) {
                    console.log('swiped left!');
                } else {
                    this.resetPosition()
                }
            }
        });
    }

    resetPosition() {
        Animated.spring(this.position, {
            toValue: { x: 0, y: 0 }
        }).start();
    }

    getCardStyle() {

        const rotate = this.position.x.interpolate({
            inputRange: [-SCREEN_WIDTH * 2, 0, SCREEN_WIDTH * 2],
            outputRange: ['-120deg', '0deg', '120deg']
        })

        return {
            ...this.position.getLayout(),
            transform: [{ rotate }]
        }
    }

    renderCards() {
        return this.props.data.map((card, i) => {

            if (i === 0) {
                return (
                    <Animated.View key={i} style={this.getCardStyle()} {...this.panResponder.panHandlers}>
                        {this.props.renderCard(card)}
                    </Animated.View>
                )
            }

            return this.props.renderCard(card);
        })
    }

    render() {
        return (
            <View>
                {this.renderCards()}
            </View>
        )
    }
}

export default Deck;