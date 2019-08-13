import React from 'react'
import { ScrollView, Platform, Alert } from 'react-native'
import * as Icon from '@expo/vector-icons'
import styled from '@emotion/native'

import Container from '~common/ui/Container'
import Header from '~common/Header'
import Link from '~common/Link'
import Text from '~common/ui/Text'
import Box from '~common/ui/Box'
import useLogin from '~helpers/useLogin'
import FireAuth from '~helpers/FireAuth'

import app from '../../../app.json'

const LinkItem = styled(Link)(({ theme }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  padding: 20,
  borderBottomWidth: 1,
  borderBottomColor: theme.colors.border
}))

const StyledIcon = styled(Icon.Feather)(({ theme, color }) => ({
  color: theme.colors[color] || theme.colors.grey,
  marginRight: 15
}))

const shareMessage = () => {
  const appUrl = Platform.OS === 'ios' ? 'https://apps.apple.com/fr/app/bible-strong/id1454738221?mt=8' : 'https://play.google.com/store/apps/details?id=com.smontlouis.biblestrong'
  return `Bible Strong App ${appUrl}`
}

const MoreScreen = () => {
  const isLogged = useLogin()

  const promptLogout = () => {
    Alert.alert('Attention', 'Voulez-vous vraiment vous déconnecter ?',
      [ { text: 'Non', onPress: () => null, style: 'cancel' },
        { text: 'Oui', onPress: () => FireAuth.logout(), style: 'destructive' }
      ])
  }

  return (
    <Container>
      <Header title='Plus' />
      <ScrollView flex={1}>
        <LinkItem route={'Search'}>
          <StyledIcon name={'search'} size={30} />
          <Text bold fontSize={15}>Recherche</Text>
        </LinkItem>
        <LinkItem href='https://bible-strong.canny.io/fonctionnalites'>
          <StyledIcon name={'sun'} size={30} />
          <Text bold fontSize={15}>Idées de fonctionnalités</Text>
        </LinkItem>
        <LinkItem href='https://bible-strong.canny.io/bugs'>
          <StyledIcon name={'alert-circle'} size={30} />
          <Text bold fontSize={15}>Bugs</Text>
        </LinkItem>
        <LinkItem href={Platform.OS === 'ios' ? 'https://apps.apple.com/fr/app/bible-strong/id1454738221?mt=8' : 'https://play.google.com/store/apps/details?id=com.smontlouis.biblestrong'}>
          <StyledIcon name={'star'} size={30} />
          <Text bold fontSize={15}>Noter l'application</Text>
        </LinkItem>
        <LinkItem share={shareMessage()}>
          <StyledIcon name={'share-2'} size={30} />
          <Text bold fontSize={15}>Partager l'application</Text>
        </LinkItem>
        <LinkItem href='https://fr.tipeee.com/smontlouis'>
          <StyledIcon name={'thumbs-up'} size={30} color='secondary' />
          <Text bold fontSize={15}>Soutenir le développeur</Text>
        </LinkItem>
        <LinkItem href='mailto:s.montlouis.calixte@gmail.com'>
          <StyledIcon name={'send'} size={30} />
          <Text bold fontSize={15} >Contacter le développeur</Text>
        </LinkItem>
        {
          isLogged &&
            (
              <LinkItem onPress={promptLogout}>
                <StyledIcon color='quart' name={'log-out'} size={30} />
                <Text bold color='quart' fontSize={15} >Se déconnecter</Text>
              </LinkItem>
            )
        }

      </ScrollView>
      <Box margin={10} alignItems='flex-end'>
        <Text color='grey' fontSize={12}>Version: {app.expo.version}</Text>
      </Box>
    </Container>
  )
}
export default MoreScreen
