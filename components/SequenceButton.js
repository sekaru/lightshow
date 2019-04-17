import React from 'react'
import { StyleSheet, Text, View, TouchableHighlight, Dimensions } from 'react-native'
import theme from '../theme'

export default class ActionButton extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      timeouts: []
    }

    this.go = this.go.bind(this)
  }

  render() {
    const { sequence } = this.props
    return (
      <TouchableHighlight onPress={this.go}>
        <View style={[styles.button, {backgroundColor: sequence.colour}]}>
          <Text style={styles.label}>{sequence.label}</Text>
        </View>
      </TouchableHighlight>
    )
  }

  go() {
    // clear all previous timeouts
    this.clearStateTimeouts()
    let timeouts = []
    let actionsExecuted = 0

    this.props.sequence.actions.forEach(action => {
      let t = setTimeout(() => {
        // how many actions we've executed so far (for looping)
        actionsExecuted++

        // turn it on
        this.getLight(action.light).on()

        // set the colour
        let colour = action.colour.split('/')
        this.getLight(action.light).color(Number(colour[0]), Number(colour[1]), Number(colour[2]), Number(colour[3]), 50)

        // loop it?
        if(this.props.sequence.loop && actionsExecuted === this.props.sequence.actions.length) {
          this.go()
        }
      }, Number(action.delay))

      timeouts.push(t)
    })

    this.setState({timeouts})
  }

  getLight(label) {
    for(let l of this.props.lights) {
      if(l.label===label) return l
    }
  }

  clearStateTimeouts() {
    this.state.timeouts.forEach(t => {
      clearTimeout(t)
    })

    this.setState({timeouts: []})
  }
}

const styles = StyleSheet.create({
  button: {
    height: 100,
    alignItems: 'center',
    justifyContent: 'center'
  },
  label: {
    color: theme.colours.white,
    fontSize: theme.fonts.md,
    textAlign: 'center'
  }
})
