import React from 'react'
import * as Icon from '@expo/vector-icons'
import { withTheme } from 'emotion-theming'
class TabBarIcon extends React.Component {
  render () {
    const { theme } = this.props
    return (
      <Icon.Feather
        name={this.props.name}
        size={23}
        style={{ marginBottom: -3 }}
        color={
          this.props.focused ? theme.colors.primary : theme.colors.tertiary
        }
      />
    )
  }
}

export default withTheme(TabBarIcon)
